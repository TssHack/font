const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// یوزر آیدی ثابت
const USER_ID = "35677315";

// مسیر GET برای دریافت خروجی فانتزی
app.get("/fancy", async (req, res) => {
    const input = req.query.text;

    if (!input || typeof input !== "string" || input.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: "پارامتر 'text' الزامی است و نباید خالی باشد."
        });
    }

    const prompt = `
کلمه "${input}" را با استفاده از یونیکد در 50 استایل مختلف فانتزی و زیبا بنویس. هر استایل باید فقط از کاراکترهای متنی (قابل کپی کردن) تشکیل شده باشد. از ایموجی یا عکس استفاده نکن. فقط خروجی را به شکل شماره‌گذاری‌شده بنویس، بدون هیچ توضیح اضافه.
`;

    try {
        const response = await axios.post(
            "https://api.binjie.fun/api/generateStream",
            {
                prompt,
                userId: USER_ID,
                network: true,
                system: "",
                withoutContext: false,
                stream: false
            },
            {
                headers: {
                    "authority": "api.binjie.fun",
                    "accept": "application/json, text/plain, */*",
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": "en-US,en;q=0.9",
                    "origin": "https://chat18.aichatos.xyz",
                    "referer": "https://chat18.aichatos.xyz/",
                    "user-agent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
                    "Content-Type": "application/json"
                },
                timeout: 15000
            }
        );

        // بازگشت متن خام پاسخ
        res.status(200).send(response.data);

    } catch (error) {
        console.error("AI API error:", error?.response?.data || error.message);

        let message = "درخواست به API هوش مصنوعی با خطا مواجه شد.";
        if (error.code === "ECONNABORTED") {
            message = "درخواست به دلیل زمان‌بر بودن متوقف شد (Timeout).";
        } else if (error.response) {
            message += ` کد خطا: ${error.response.status}`;
        }

        res.status(500).json({
            success: false,
            error: message
        });
    }
});

// روت اصلی
app.get("/", (req, res) => {
    res.send("API فانتزی‌ساز فعال است. استفاده: /fancy?text=ehsan");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
