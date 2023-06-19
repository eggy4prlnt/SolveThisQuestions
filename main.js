const api_key = ''; // your API key here (sk-xxxxxx)

askToGPT = function (word) {
    var query = word.selectionText;

   if (api_key == '' || api_key == undefined) {
        chrome.tabs.create({ url: "javascript:alert('Please enter your API key!')" });
        return;
    }
    
    fetch("https://api.openai.com/v1/completions", {
        body: JSON.stringify({
            "model": "text-davinci-003",
            "prompt": "Question : " + query + "\nAnswer :",
            "max_tokens": 100,
            "temperature": 0,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "stop": ["\n"]
        }),
        headers: {
            Authorization: "Bearer " + api_key,
            "Content-Type": "application/json"
        },
        method: "POST"
    }).then(function (response) {
        return response.json();
    }).then(function (json) {
        var answer = json.choices[0].text;

        // clear all notifications
        chrome.notifications.getAll(function (notifications) {
            for (var key in notifications) {
                chrome.notifications.clear(key);
            }
        });

        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Question Solver - Answer",
            message: answer,
        });
    }).catch(function (error) {
        console.log(error);
    });

};

chrome.contextMenus.removeAll(function () {
    chrome.contextMenus.create({
        id: "1",
        title: "Solve this question!",
        contexts: ["selection"],
    });
})

chrome.runtime.onInstalled.addListener(() => {
    if (api_key == '' || api_key == undefined) {
        chrome.tabs.create({ url: "javascript:alert('Please set your API key in the extension options!')" });
    } else {
        chrome.tabs.create({ url: "javascript:alert('All set! You can now use the extension!')" });
    }
});

chrome.contextMenus.onClicked.addListener(askToGPT);