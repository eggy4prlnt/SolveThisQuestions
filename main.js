const api_key = ''; // your API key here (sk-xxxxxx)

askToGPT = function (word) {
    try {

        var query = word.selectionText;

        if (api_key == '' || api_key == undefined) {
            chrome.tabs.create({ url: "javascript:alert('Please enter your API key!')" });
            return;
        }

        fetch("https://api.openai.com/v1/completions", {
            body: JSON.stringify({
                "model": "text-davinci-003",
                "prompt": "Selesaikan soal ini dengan jawaban A,B,C,D atau E\n\nQuestion : " + query + "\nAnswer :",
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
            
            if (json.error && json.error.code != '') {

                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "assets/icons/icon.png",
                    title: "Solve This Questions! - Error",
                    message: `[${json.error.code}] ${json.error.message ?? ''}`,
                });

            } else {
                var answer = json.choices[0].text;

                // clear all notifications
                chrome.notifications.getAll(function (notifications) {
                    for (var key in notifications) {
                        chrome.notifications.clear(key);
                    }
                });

                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "assets/icons/icon.png",
                    title: "Solve This Questions! - Answer",
                    message: answer,
                });
            }

        }).catch(function (error) {
            console.log(error);
        });

    } catch (error) {
        console.log(error);
    }

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
