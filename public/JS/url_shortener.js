document.addEventListener("DOMContentLoaded", function () {
  // JavaScript to handle form submission and link visibility
  const form = document.getElementById("urlForm");

  // Copy_btn
  const copyButton = document.getElementById("copyButton");

  //Icons
  const clipboardIcon = document.getElementById("clipboardIcon");
  const checkIcon = document.getElementById("checkIcon");

  //Visit URL btn
  const url_visit = document.getElementById("visit_btn");

  //New URL btn
  const new_url = document.getElementById("new_url_btn");

  //Share URL btn
  const Share_url = document.getElementById("share_url_btn");

  //Create Qr Code
  const create_Qr_btn = document.getElementById("create_Qr_code_btn");
  create_Qr_btn.addEventListener("click", function () {
    var dropdown = document.getElementById("Qr_myDropdown");
    dropdown.classList.toggle("show");

    var Qr_action_btn = document.getElementById("Qr_action_btn");
    if (Qr_action_btn.style.display === "grid") {
      Qr_action_btn.style.display = "none";
    } else {
      Qr_action_btn.style.display = "grid";
    }
  });

  //Cancel button
  const cancel_btn = document.getElementById("cancel_btn");

  cancel_btn.addEventListener("click", function () {
    var dropdown = document.getElementById("Qr_myDropdown");
    var Qr_action_btn = document.getElementById("Qr_action_btn");
    if (dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    }

    if (Qr_action_btn.style.display === "grid") {
      Qr_action_btn.style.display = "none";
    }
  });

  //Download Button

  const download_btn = document.getElementById("download_btn");

  download_btn.addEventListener("click", function () {
    const qrImage = document.getElementById("qrCodeImage");
    const imageUrl = qrImage.src;

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "qr_code.png"; // Default name for the downloaded file
    link.click();
  });

  // Close the dropdown if the user clicks outside of it
  window.onclick = function (event) {
    if (!event.target.closest("#create_Qr_code_btn")) {
      var dropdown = document.getElementById("Qr_myDropdown");
      var Qr_action_btn = document.getElementById("Qr_action_btn");

      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      }

      if (Qr_action_btn.style.display === "grid") {
        Qr_action_btn.style.display = "none";
      }
    }
  };

  //Share the link
  Share_url.addEventListener("click", function () {
    var dropdown = document.getElementById("myDropdown");
    dropdown.classList.toggle("show");
  });

  // Reloading the page
  new_url.addEventListener("click", function () {
    window.location.reload();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    //User url
    const user_entered_url = document.getElementById("user_url").value;
    const input = user_entered_url;

    var url_data = {
      user_url: input,
    };

    const spinnerIcon = document.getElementById("spinnerIcon");
    const buttonText = document.getElementById("buttonText");
    const loadButton = document.getElementById("get_url_btn");

    // Show the spinner and change button text
    spinnerIcon.style.display = "inline-block"; // Show the spinner
    buttonText.textContent = " Loading..."; // Change button text with leading space
    loadButton.disabled = true; // Disable the button while loading

    // // Simulate a delay (e.g., for an API call)
    // setTimeout(function () {
    //   spinnerIcon.style.display = "none"; // Hide the spinner
    //   buttonText.textContent = "Get Url"; // Reset button text
    //   loadButton.disabled = false; // Re-enable the button
    // }, 3000);

    fetch("/urlshort/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(url_data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        const linkWrapper = document.getElementsByClassName("link_wrapper")[0];
        const errorWrap =
          document.getElementsByClassName("shorten_url_error")[0];
        const errorDisplay = document.getElementById("error_display");
        const get_url_btn = document.getElementById("get_url_btn");

        if (!linkWrapper || !errorWrap || !errorDisplay) {
          return console.error(
            "Link wrapper or error display elements not found!"
          );
        }

        if (data.shortened_url) {
          document.getElementById("short_url").textContent = data.shortened_url;

          linkWrapper.style.display = "flex";
          get_url_btn.style.display = "none";
          errorWrap.style.display = "none";

          copyButton.addEventListener("click", function () {
            // Hide the clipboard icon and show the checkmark icon
            clipboardIcon.style.display = "none";
            checkIcon.style.display = "inline-block"; // Show checkmark icon

            navigator.clipboard.writeText(data.shortened_url);
            // Set a timeout to revert the icons after 2 seconds
            setTimeout(function () {
              clipboardIcon.style.display = "inline-block";
              checkIcon.style.display = "none";
            }, 2000); // 2000 milliseconds = 2 seconds
          });

          url_visit.addEventListener("click", function () {
            if (data && data.shortened_url) {
              window.open("http://" + data.shortened_url, "_blank"); // Opens in a new tab
            } else {
              console.error("No shortened URL found to visit.");
            }
          });

          // Sharing to WhatsApp
          document
            .getElementById("whatsapp_btn")
            .addEventListener("click", function () {
              var message =
                "Check out this amazing website: " + data.shortened_url;
              var whatsappUrl =
                "https://api.whatsapp.com/send?text=" +
                encodeURIComponent(message);
              window.open(whatsappUrl, "_blank");
            });

          // Sharing to LinkedIn
          document
            .getElementById("linkedin_btn")
            .addEventListener("click", function () {
              var url = data.shortened_url;
              var linkedinUrl =
                "https://www.linkedin.com/sharing/share-offsite/?url=" +
                encodeURIComponent(url);
              window.open(linkedinUrl, "_blank");
            });

          // Sharing to Twitter
          document
            .getElementById("twitter_btn")
            .addEventListener("click", function () {
              var url = data.shortened_url;
              var text = "Check out this amazing website!";
              var twitterUrl =
                "https://twitter.com/intent/tweet?text=" +
                encodeURIComponent(text) +
                "&url=" +
                encodeURIComponent(url);
              window.open(twitterUrl, "_blank");
            });

          // Close the dropdown if the user clicks outside of it
          window.onclick = function (event) {
            if (!event.target.matches(".submit_button")) {
              var dropdowns =
                document.getElementsByClassName("dropdown-content");
              var Qr_code_image = document.getElementById("qrCodeImage");
              Qr_code_image.src = "data:image/png;base64," + data.Qr_code;
              // console.log(data.Qr_code);

              for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains("show")) {
                  openDropdown.classList.remove("show");
                }
              }
            }
          };
        } else {
          linkWrapper.style.display = "none";
          get_url_btn.style.display = "block";
          errorWrap.style.display = "block";
          errorDisplay.textContent = "No URL found in the response";
        }
      })
      .catch((error) => {
        const linkWrapper = document.getElementsByClassName("link_wrapper")[0];
        const errorWrap =
          document.getElementsByClassName("shorten_url_error")[0];
        const errorDisplay = document.getElementById("error_display");
        const get_url_btn = document.getElementById("get_url_btn");

        if (!linkWrapper || !errorWrap || !errorDisplay) {
          return console.error(
            "Link wrapper or error display elements not found!"
          );
        }

        linkWrapper.style.display = "none";
        get_url_btn.style.display = "block";
        errorWrap.style.display = "block";
        errorDisplay.textContent = error.message; // Display the error message from the server
      })
      .finally(() => {
        // Hide the spinner and reset button text after the fetch completes
        spinnerIcon.style.display = "none"; // Hide the spinner
        buttonText.textContent = "Get Url"; // Reset button text
        loadButton.disabled = false; // Re-enable the button
      });

    // if (urlPattern.test(input)) {
    //   var url_data = {
    //     user_url: input,
    //   };

    //   fetch("/urlshort/data", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(url_data),
    //   })
    //     .then((response) => {
    //       if (!response.ok) {
    //         console.log(response);

    //         throw new Error(`Server error: ${response}`);
    //       }
    //       return response.json();
    //     })
    //     .then((data) => {
    //       if (data.url) {
    //         document.getElementById("short_url").textContent = data.url;

    //         const linkWrapper =
    //           document.getElementsByClassName("link_wrapper")[0]; // Access the first element
    //         var error_wrap =
    //           document.getElementsByClassName("shorten_url_error");
    //         var error_display = document.getElementById("error_display");
    //         if (linkWrapper) {
    //           linkWrapper.style.display = "flex"; // Show the link_wrapper
    //           error_wrap[0].style.display = "none";
    //         } else {
    //           if (error_wrap.length > 0 && error_display) {
    //             linkWrapper.style.display = "none";
    //             error_wrap[0].style.display = "block"; // Since getElementsByClassName returns a collection, we need to select the first element
    //             error_display.textContent = "Link Object not found!";
    //           } else {
    //             console.error("Error display element or wrapper not found!");
    //           }
    //         }
    //       } else {
    //         const linkWrapper =
    //           document.getElementsByClassName("link_wrapper")[0]; // Access the first element

    //         var error_wrap =
    //           document.getElementsByClassName("shorten_url_error");
    //         var error_display = document.getElementById("error_display");

    //         if (error_wrap.length > 0 && error_display) {
    //           linkWrapper.style.display = "none";
    //           error_wrap[0].style.display = "block";
    //           error_display.textContent = "No URL found in the response";
    //         } else {
    //           console.error("Error display element or wrapper not found!");
    //         }
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);

    //       const linkWrapper =
    //         document.getElementsByClassName("link_wrapper")[0]; // Access the first element
    //       var error_wrap = document.getElementsByClassName("shorten_url_error");
    //       var error_display = document.getElementById("error_display");

    //       if (error_wrap.length > 0 && error_display) {
    //         linkWrapper.style.display = "none";
    //         error_wrap[0].style.display = "block";
    //         error_display.textContent = error.message; // Show the error message
    //       } else {
    //         console.error("Error display element or wrapper not found!");
    //       }
    //     });
    // } else {
    //   var error_wrap = document.getElementsByClassName("shorten_url_error");
    //   var error_display = document.getElementById("error_display");
    //   const linkWrapper = document.getElementsByClassName("link_wrapper")[0]; // Access the first element
    //   if (error_wrap.length > 0 && error_display) {
    //     linkWrapper.style.display = "none";
    //     error_wrap[0].style.display = "block";
    //     error_display.textContent = "Invalid Url";
    //   } else {
    //     console.error("Error display element or wrapper not found!");
    //   }
    // }

    // Check if linkWrapper is defined
  });
});
