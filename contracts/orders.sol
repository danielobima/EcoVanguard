// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

//an enum for what state the current order is in
enum OrderState{
    created, accepted, delivered
}

//a struct that defines the structure of all orders made
struct Order{
    address innovator;
    address recycler;
    uint256 requested_kg;
    OrderState state;
}

contract ordering{
    address public owner; 

    mapping (uint256=> Order) public orders;
    uint256 public orderCounter; //count how many orders have been created + used for order ID

    //event to be emitted after certain actions
    event OrderCreated(uint256 orderID);
    event OrderAccepted(uint256 orderID);
    event OrderDelivered(uint256 orderID);

    constructor(){
        owner = msg.sender; //set the owner to whoever deploys this contract
    }

    //a function for creating an order
    function CreateOrder(uint256 requested_kg) public {
        require (msg.sender != address(0), "Not a valid address"); //sender address must not be null
        orderCounter++;

        //create the order 
        orders[orderCounter] = Order(
            msg.sender, address(0), requested_kg, OrderState.created
        );
        emit OrderCreated(orderCounter);
    }

    //a function to allow a recycler to accept an order
    function AcceptOrder(uint256 _orderID, address _acceptor) public{
        require(msg.sender != address(0), "Not a valid address");
        require(orders[_orderID].state == OrderState.created, "Order isn't created");
        
        //set the address of accepting and change state for the order
        orders[_orderID].recycler = _acceptor;
        orders[_orderID].state = OrderState.accepted;
        emit OrderAccepted(_orderID);
    }

    //a function to allow the innovator to mark an order as delivered
    function MarkDelivery(uint256 _orderID) public{
        require(msg.sender == orders[_orderID].innovator, "Only the buying innovator can mark order as delivered");
        require(orders[_orderID].state == OrderState.accepted, "Only accepted orders can be delivered");

        //set the state of current order to delivered
        orders[_orderID].state = OrderState.delivered;
        emit OrderDelivered(_orderID);
    }
}