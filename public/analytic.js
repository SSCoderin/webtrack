(function () {
    console.log("analytic start tracking")

    const script = document.currentScript;
    const websiteId = script.getAttribute("data-website-id");
    const domain = script.getAttribute("data-domain");

    console.log("webid ", websiteId);
    console.log("domain ", domain);

    fetch("http://localhost:3000/api/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            websiteId,
            domain
        })
    })
})();