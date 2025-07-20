// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { OApp } from "./OApp.sol";
import { MessagingFee, MessagingReceipt } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import { Origin } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroReceiver.sol"; // ✅ REQUIRED

abstract contract SameDex is OApp {
    event Bridged(uint32 dstEid, address token, uint256 amount, address receiver);
    event Received(uint32 srcEid, address token, uint256 amount, address sender);

    constructor(address _endpoint, address _delegate) OApp(_endpoint, _delegate) {}

    function _bridge(
        uint32 dstEid,
        address token,
        uint256 amount,
        address receiver,
        bytes memory options
    ) internal virtual {
        bytes memory payload = abi.encode(token, amount, receiver);

        MessagingFee memory fee = _quote(dstEid, payload, options, false);

        _lzSend(dstEid, payload, options, fee, msg.sender);
    }

    function _lzReceive(
        Origin calldata origin,
        bytes32, // guid
        bytes calldata message,
        address, // executor
        bytes calldata // extraData
    ) internal virtual override {
        (address token, uint256 amount, address to) = abi.decode(message, (address, uint256, address));
        _handleReceive(origin.srcEid, token, amount, to);

        emit Received(origin.srcEid, token, amount, to);
    }

    function _handleReceive(
        uint32 srcEid,
        address token,
        uint256 amount,
        address to
    ) internal virtual;
}
