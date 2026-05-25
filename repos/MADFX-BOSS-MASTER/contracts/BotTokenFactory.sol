// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/upgradeable-proxy/utils/UUPSUpgradeable.sol";

/**
 * @title BotToken
 * @dev A basic ERC20 token that can be deployed by the BotTokenFactory.
 * It allows the factory owner to mint and burn tokens for ecosystem rewards.
 */
contract BotToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol, address initialOwner) 
        ERC20(name, symbol) 
        Ownable(initialOwner) 
    {}

    /**
     * @dev Mints tokens to a specific address. Only the owner (Factory) can call this.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burns tokens from a specific address.
     */
    function burnFrom(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

/**
 * @title BotTokenFactory
 * @dev Factory contract to deploy and manage multiple BotTokens for the MADFX ecosystem.
 */
contract BotTokenFactory is Ownable {
    address[] public allTokens;
    mapping(address => bool) public isBotToken;

    event TokenCreated(address indexed tokenAddress, string name, string symbol);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Deploys a new ERC20 BotToken.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     */
    function createToken(string memory name, string memory symbol) external onlyOwner returns (address) {
        BotToken newToken = new BotToken(name, symbol, msg.sender);
        address tokenAddress = address(newToken);
        
        allTokens.push(tokenAddress);
        isBotToken[tokenAddress] = true;

        emit TokenCreated(tokenAddress, name, symbol);
        return tokenAddress;
    }

    /**
     * @dev Returns the total number of tokens created.
     */
    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }

    /**
     * @dev Returns the address of a token at a specific index.
     */
    function getTokenAddress(uint256 index) external view returns (address) {
        require(index < allTokens.length, "Index out of bounds");
        return allTokens[index];
    }

    /**
     * @dev Admin function to mint tokens in a managed BotToken.
     * This allows the Factory Owner to act as the owner of all deployed tokens.
     */
    function mintInToken(address tokenAddress, address to, uint256 amount) external onlyOwner {
        require(isBotToken[tokenAddress], "Not a valid BotToken managed by this factory");
        BotToken(tokenAddress).mint(to, amount);
    }

    /**
     * @dev Admin function to burn tokens in a managed BotToken.
     */
    function burnInToken(address tokenAddress, address from, uint256 amount) external onlyOwner {
        require(isBotToken[tokenAddress], "Not a valid BotToken managed by this factory");
        BotToken(tokenAddress).burnFrom(from, amount);
    }
}
