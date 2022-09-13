//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./token/ERC721/extensions/ERC721Enumerable.sol";
import "./access/Ownable.sol";

contract RPSFeverNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public maxSupply = 900;
    bool public paused = false;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
        mint(msg.sender);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function mint(address _to) public payable {
        uint256 supply = totalSupply();
        require(!paused, "token is paused");
        require(supply + 3 <= maxSupply, "max supply reached");
        require(walletOfOwner(_to).length < 3, "owner already has 3 tokens");

        for (uint256 i = 1; i <= 3; i++) {
            _safeMint(_to, supply + i);
        }
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    uint counter = 1;
    function randomNumber() private returns (uint) {
        counter++;
        return (uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, totalSupply() , counter)))%3);
    }

    function rewardPlayerWin() private {
         (bool success, ) = payable(msg.sender).call{
            value: 20000000000000000
        }("");
        require(success, "failed to send ether");
    }

    function rewardPlayerTie() private {
         (bool success, ) = payable(msg.sender).call{
            value: 10000000000000000
        }("");
        require(success, "failed to send ether");
    }


    function gameResults(uint _player, uint bot) private pure returns (uint) {
        // rock paper scissors
        // 0 = rock, 1 = paper, 2 = scissors
        // 0 = lose, 1 = win, 2 = tie

        if (_player == bot) {
            return 2;
        }

        if (_player == 0 && bot == 2) {
            return 1;
        }
        if (_player == 1 && bot == 0) {
            return 1;
        }
        if (_player == 2 && bot == 1) {
            return 1;
        }
        return 0;
    }

    event GameResults(uint _player, uint _bot, uint _result);

    function game(uint _tokenId) public payable {
        require(msg.value >= 10000000000000000, "must send 0.01 Value");
        require(!paused, "token is paused");
        require(_exists(_tokenId), "token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "only owner of nft can play");

        uint randomNo = randomNumber();
        uint tokenId = _tokenId;
        uint player = tokenId % 3;
        uint result = gameResults(player, randomNo);
        if (result == 1) {
            rewardPlayerWin();
        } else if (result == 2) {
            rewardPlayerTie();
        }
        emit GameResults(player, randomNo, result);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    //only owner
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function withdraw(uint _amount) public payable onlyOwner {
        require(_amount > 0, "amount must be greater than 0");
        require(address(this).balance >= _amount, "insufficient balance");
        (bool success, ) = payable(msg.sender).call{
            value: _amount
        }("");
        require(success);
    }

}
