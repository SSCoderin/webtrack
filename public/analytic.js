(function () {
    console.log("analytic start tracking");

    function generateUUID() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    let visitorID = localStorage.getItem("visitorID");

    if (!visitorID) {
        visitorID = generateUUID();
        localStorage.setItem("visitorID", visitorID);
    }

    const script = document.currentScript;
    const websiteId = script.getAttribute("data-website-id");
    const domain = script.getAttribute("data-domain");

    const entryTime = Date.now();
    const referrer = document.referrer || "Direct";

    const utm_params = new URLSearchParams(window.location.search);

    const utm_source = utm_params.get("utm_source") || "";
    const utm_medium = utm_params.get("utm_medium") || "";
    const utm_campaign = utm_params.get("utm_campaign") || "";
    const utm_term = utm_params.get("utm_term") || "";
    const utm_content = utm_params.get("utm_content") || "";

    const refparams = window.location.href.split("?")[1] || "";

    if (refparams) {
        localStorage.setItem("refparams", refparams);
    }

    // ENTRY EVENT
    fetch("http://localhost:3000/api/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: "entry",
            websiteId,
            domain,
            entryTime,
            referrer,
            url: window.location.href,
            visitorID,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content,
            refparams
        })
    });

    let activestarttime = Date.now();

    const handleExit = () => {
        const exitTime = Date.now();
        const totalactivetime = exitTime - activestarttime;

        const payload = JSON.stringify({
            type: "exit",
            websiteId,
            domain,
            exitTime,
            totalactivetime,
            url: window.location.href,
            visitorID
        });

        navigator.sendBeacon("http://localhost:3000/api/track", payload);
    };

    window.addEventListener("beforeunload", handleExit);
})();