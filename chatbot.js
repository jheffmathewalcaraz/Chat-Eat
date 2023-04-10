
function openForm() {
    document.getElementById("myForm").style.display = "block";
}



// Get the chat body element
var chatBody = document.getElementById("chat-body");

// Function to add a message to the chat body
function addMessage(message, sender) {
    var messageElement = document.createElement("div");
    messageElement.classList.add("chat-message");
    messageElement.classList.add(sender + "-message");
    messageElement.innerHTML = message;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}


// Function to handle user input
function sendMessage() {
    var userInput = document.getElementById("user-input");
    var message = userInput.value;
    if (message) {
        addMessage(message, "user");
        handleUserMessage(message);
        userInput.value = "";
    }
}

document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

var order = {
    "burger meal": 0,
    "pasta meal": 0,
    "chicken meal": 0,
    "softdrink": 0,
    "softdrink_medium": 0,
    "softdrink_large": 0,
    "iced tea": 0,
    "iced tea_medium": 0,
    "iced tea_large": 0,
    "fries": 0,
    "fries_medium": 0,
    "fries_large": 0,
    "sundae": 0,
    "pie": 0
};

var prices = {
    "burger meal": 190,
    "pasta meal": 200,
    "chicken meal": 200,
    "softdrink": 50,
    "softdrink_medium": 59,
    "softdrink_large": 79,
    "iced tea": 50,
    "iced tea_medium": 59,
    "iced tea_large": 79,
    "fries": 49,
    "fries_medium": 59,
    "fries_large": 70,
    "sundae": 49,
    "pie": 59
};

var orderComplete = false;

function summarizeOrder() {
    var summary = "Your order:\n<br>";
    var totalPrice = 0;
    for (var item in order) {
        if (order[item] > 0) {
            summary += item + " x " + order[item] + "\n<br>";
            totalPrice += order[item] * prices[item];
        }
    }
    summary += "\nTotal price: ₱" + totalPrice.toFixed(2);
    addMessage(summary, "bot");
}

var meal = "";

function handleUserMessage(message) {
    var response;
    message = message.toLowerCase();

    if (!orderComplete) {
        if (message.includes("burger meal") || message.includes("pasta meal")) {
            meal = message;
            order[meal]++;
            response = "Would you like fries or sundae with your meal?";
        } else if (message.includes("chicken meal")) {
            meal = message;
            order[meal]++;
            response = "What drink would you like, softdrink or iced tea?";
        } else if (message.includes("fries")) {
            if (meal) {
                order[message]++;
                response = "What drink would you like, softdrink or iced tea?";
            } else {
                response = "Please select a meal first.";
            }
        } else if (message.includes("sundae")) {
            if (meal) {
                order[message]++;
                response = "What drink would you like, softdrink or iced tea?";
            } else {
                response = "Please select a meal first.";
            }
        } else if (message.includes("softdrink") || message.includes("iced tea")) {
            order[message]++;
            if ((meal === "burger meal" || meal === "pasta meal") && order["fries"] > 0) {
                response = "Would you like to upgrade your fries and drinks to medium or large?";
            } else {
                response = "Would you like to upgrade your drinks to medium or large?";
            }
        } else if (message.includes("medium") || message.includes("large") || message.includes("no upgrade")) {
            var size = message;
            if (message.includes("no upgrade")) {
                size = "";
            }
            if (order["softdrink"] > 0) {
                if (size) {
                    order["softdrink_" + size]++;
                    order["softdrink"]--;
                }
            } else if (order["iced tea"] > 0) {
                if (size) {
                    order["iced tea_" + size]++;
                    order["iced tea"]--;
                }
            } else if (order["fries"] > 0 && (meal === "burger meal" || meal === "pasta meal")) {
                if (size) {
                    order["fries_" + size]++;
                    order["fries"]--;
                }
            }

            if (order["sundae"] > 0) {
                response = "Is your order complete?";
            } else {
                response = "Would you like to add a sundae to your meal?";
            }
        } else if (message.includes("yes")) {
            order["sundae"]++;
            response = "Is your order complete?";
        } else if (message.includes("not yet")) {
            response = "What else would you like to add to your order?";
        } else if (message.includes("no") || message.includes("no thanks")) {
            response = "Is your order complete?";
        } else if (message.includes("order complete")) {
            response = "Would you like to add a pie to your order?";
            orderComplete = true;
        } else {
            response = "I didn't understand your request. Please choose a meal.";
        }
    } else {
        if (message.includes("add pie")) {
            order["pie"]++;
            response = "Your order is already complete.";
            summarizeOrder();
        } else if (message.includes("no pie")) {
            response = "Your order is already complete.";
            summarizeOrder();
        } else {
            response = "Your order is already complete.";
            summarizeOrder();
        }
    }

    addMessage(response, "bot");
}






function closeForm() {
    document.getElementById("myForm").style.display = "none";
}
