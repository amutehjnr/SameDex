// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { SameDex } from "./SameDex.sol";
import { OptionsBuilder } from "./OptionsBuilder.sol";

interface IERC20Mintable is IERC20 {
    function mint(address to, uint256 amount) external;
}

interface IERC20Burnable is IERC20 {
    function burnFrom(address from, uint256 amount) external;
}

contract WrappedTokenBridge is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    SameDex
{
    using SafeERC20 for IERC20;

    address public nativeToken;

    function initialize(
        address _endpoint,
        address _delegate,
        address _nativeToken
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __SameDex_init(_endpoint, _delegate);
        nativeToken = _nativeToken;
    }

    function bridge(
        uint32 dstEid,
        address token,
        uint256 amount,
        address receiver
    ) external payable {
        if (token == address(0)) {
            require(msg.value == amount, "Native value mismatch");
        } else {
            IERC20Burnable(token).burnFrom(msg.sender, amount);
        }

        bytes memory payload = abi.encode(token, amount, receiver);

        bytes memory options = OptionsBuilder.newOptions();
        options = OptionsBuilder.addExecutorLzReceiveOption(options, 200_000, 0);

        _lzSend(dstEid, payload, options, _quote(dstEid, payload, options, false), msg.sender);

        emit Bridged(dstEid, token, amount, receiver);
    }

    function _handleReceive(
        uint32, // srcEid
        address token,
        uint256 amount,
        address to
    ) internal override {
        if (token == address(0)) {
            (bool sent, ) = to.call{value: amount}("");
            require(sent, "Native token transfer failed");
        } else {
            IERC20Mintable(token).mint(to, amount);
        }
    }

    function setNativeToken(address _nativeToken) external onlyOwner {
        nativeToken = _nativeToken;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    receive() external payable {}
}
