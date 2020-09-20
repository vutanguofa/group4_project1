checkCustomerName();

// Start of address validation function
function validateAddress() {
    //var apiKey = "av-219b5d3a55b7bab918373de09c364935";
    var apiKey = "";

    // Declaing variables
    var customerNameField = document.querySelector('#customerName').value;
    var streetAddressField = document.querySelector('#streetAddress').value;
    var cityField = document.querySelector('#city').value;
    var stateField = document.querySelector('#state').value;
    var postalCodeField = document.querySelector('#postalCode').value;
    var countryCodeField = document.querySelector('#countryCode').value;
    // Creating a variable to store the order amount
    var orderAmt = parseFloat(document.querySelector('#orderAmt').value);
    var shipAmt = parseFloat(5.00);
    var orderTotal = orderAmt + shipAmt;
    var maskColor = document.querySelector('#maskColor').value;

    // Storing variable to local storage
    localStorage.setItem("customerName1", customerNameField);
    localStorage.setItem("streetAddress1", streetAddressField);
    localStorage.setItem("city1", cityField);
    localStorage.setItem("state1", stateField);
    localStorage.setItem("postalCode1", postalCodeField);
    localStorage.setItem("countryCode1", countryCodeField);
    localStorage.setItem("orderAmt1", orderAmt);
    localStorage.setItem("shipAmt1", shipAmt);
    localStorage.setItem("orderTotal1", orderTotal);
    localStorage.setItem("maskColor1", maskColor);
    // End of local storage

    // Shipping address API
    fetch('https://cors-anywhere.herokuapp.com/https://api.address-validator.net/api/verify?StreetAddress=' + streetAddress +
        '&City=' + cityField +
        '&State=' + stateField +
        '&PostalCode=' + postalCodeField +
        '&CountryCode=' + countryCodeField +
        '&APIKey=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log("Shipping address is: " + data.status);
            if (data.status === "VALID") {
                $("#validationStatus").attr("style", "background-color: #58ce7b").text("Valid address.");
                //$("#paypal-button-container").show();
            } else {
                $("#validationStatus").attr("style", "background-color: #fc665e").text("Invalid address. Please correct your shipping address.");
                $("#paypal-button-container").show();
            };
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};
// End of address validation function

// Hide PayPal button until address validation is successful"
$("#paypal-button-container").hide();

// Start of PayPal create order API
paypal.Buttons({
    style: {
        color: 'blue',
        shape: 'pill',
        label: 'pay',
        height: 40
    },
    createOrder: function (data, actions) {
        return actions.order.create({
            application_context: {
                brand_name: 'Group Four',
            },
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: localStorage.getItem("orderTotal1"),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: localStorage.getItem("orderAmt1")
                            },
                            shipping: {
                                currency_code: 'USD',
                                value: localStorage.getItem("shipAmt1")
                            }
                        }
                    },
                    items: [
                        {
                            name: 'Face Masks',
                            description: localStorage.getItem("maskColor1"),
                            unit_amount: {
                                currency_code: 'USD',
                                value: localStorage.getItem("orderAmt1")
                            },
                            quantity: '1',
                            category: 'PHYSICAL_GOODS'
                        },
                    ],
                    shipping: {
                        name: {
                            full_name: localStorage.getItem("customerName1"),
                        },
                        address: {
                            address_line_1: localStorage.getItem("streetAddress1"),
                            //address_line_2: data.addressline2,
                            admin_area_2: localStorage.getItem("city1"),
                            admin_area_1: localStorage.getItem("state1"),
                            postal_code: localStorage.getItem("postalCode1"),
                            country_code: "US"
                        }
                    }
                }
            ]
        });
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
            console.log("Details from PayPal API: ", details);
            $("#productSection").hide();
            $("#confirmation").text("Thank you for your order! Your package will arrive within 3 to 5 business days.");
            $("#paypal-button-container").hide();
        });
    },
    onCancel: function (data, actions) {
        console.log('user cancelled-', data);
    },
    onError: function (data, actions) {
        console.log('error occured-s', data);
        var error = data;
        alert(error);
    }
}).render('#paypal-button-container');
//End of PayPal button

// // CustomerName Check
function checkCustomerName() {
    var checkName = localStorage.getItem("customerName1");
    var checkStreet = localStorage.getItem("streetAddress1");
    var checkCity = localStorage.getItem("city1");
    var checkState = localStorage.getItem("state1");
    var checkPostalCode = localStorage.getItem("postalCode1");
    var checkCountryCode = localStorage.getItem("countryCode1");
    if (checkName == null) {
        console.log("");
    } else {
        // Get local storage details for shipping address
        $("#customerName").val(checkName);
        $("#streetAddress").val(checkStreet);
        $("#city").val(checkCity);
        $("#state").val(checkState);
        $("#postalCode").val(checkPostalCode);
        $("#countryCode").val(checkCountryCode);
    }
};