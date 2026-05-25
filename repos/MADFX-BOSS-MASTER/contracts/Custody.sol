// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Custody
 * @dev Secure smart contract for user fund custody and profit redistribution.
 * Logic: Profit split 90% User / 10% Platform Treasury.
 */
contract Custody is Ownable, ReentrancyGuard {
    address public treasury;
    IERC20 public usdcToken;

    mapping(address => uint256) public userBalances;
    mapping(address => uint256) public userETHBalances;

    event Deposited(address indexed user, address token, uint256 amount);
    event Withdrawn(address indexed user, address token, uint256 amount);
    event ProfitDistributed(address indexed user, uint256 userShare, uint256 treasuryShare);

    constructor(address _treasury, address _usdcToken) Ownable(msg.sender) {
        treasury = _treasury;
        usdcToken = IERC20(_usdcToken);
    }

    /**
     * @dev Deposit USDC into the custody contract.
     */
    function depositUSDC(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
        
        userBalances[msg.sender] += amount;
        emit Deposited(msg.sender, address(usdcToken), amount);
    }

    /**
     * @dev Deposit ETH into the custody contract.
     */
    function depositETH() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        userETHBalances[msg.sender] += msg.value;
        emit Deposited(msg.sender, address(0), msg.value);
    }

    /**
     * @dev Withdraw USDC.
     */
    function withdrawUSDC(uint256 amount) external nonReentrant {
        require(userBalances[msg.sender] >= amount, "Insufficient USDC balance");
        userBalances[msg.sender] -= amount;
        require(usdcToken.transfer(msg.sender, amount), "USDC transfer failed");
        emit Withdrawn(msg.sender, address(usdcToken), amount);
    }

    /**
     * @dev Withdraw ETH.
     */
    function withdrawETH(uint256 amount) external nonReentrant {
        require(userETHBalances[msg.sender] >= amount, "Insufficient ETH balance");
        userETHBalances[msg.sender] -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");
        emit Withdrawn(msg.sender, address(0), amount);
    }

    /**
     * @dev Distribute profit. 90% to user, 10% to treasury.
     * This function is called by the Trading Bot/System after a successful trade.
     */
    function distributeProfitUSDC(address user, uint256 totalProfit) external onlyOwner nonReentrant {
        require(totalProfit > 0, "Profit must be greater than 0");
        
        uint256 userShare = (totalProfit * 90) / 100;
        uint256 treasuryShare = totalProfit - userShare;

        userBalances[user] += userShare;
        
        // Transfer treasury share immediately to the treasury wallet
        require(usdcToken.transfer(treasury, treasuryShare), "Treasury transfer failed");

        emit ProfitDistributed(user, userShare, treasuryShare);
    }

    /**
     * @dev Update treasury address.
     */
    function setTreasury(address _newTreasury) external onlyOwner {
        treasury = _newTreasury;
    }

    function getBalanceUSDC(address user) external view returns (uint256) {
        return userBalances[user];
    }

    function getBalanceETH(address user) external view returns (uint256) {
        return userETHBalances[user];
    }
}
