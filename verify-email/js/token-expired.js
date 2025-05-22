import fetchClient from "../../shared/util/fetchClient.js";

const requestButton = document.getElementById("requestButton");

requestButton.addEventListener("click", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    const res = await fetchClient("/auth/resend-confirmation?userId=" + userId);

    // if (res.status == 404) {
    //     window.location.reload();
    // }

    // window.location.replace("/login");
});