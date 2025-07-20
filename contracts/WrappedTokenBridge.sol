// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

contract WrappedTokenBridge is SameDex {
    using SafeERC20 for IERC20;

    constructor(address _endpoint, address _delegate) SameDex(_endpoint, _delegate) {}

    function bridge(
        uint32 dstEid,
        address token,
        uint256 amount,
        address receiver
    ) external payable {
        IERC20Burnable(token).burnFrom(msg.sender, amount);

        bytes memory options = OptionsBuilder.newOptions();
        options = OptionsBuilder.addExecutorLzReceiveOption(options, 200_000, 0); // adjust gas if needed

        _bridge(dstEid, token, amount, receiver, options);

        emit Bridged(dstEid, token, amount, receiver);
    }

    function _handleReceive(
        uint32, // srcEid
        address token,
        uint256 amount,
        address to
    ) internal override {
        IERC20Mintable(token).mint(to, amount);
    }

    
}
