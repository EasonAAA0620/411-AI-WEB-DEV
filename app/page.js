"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
// 單字卡
import VocabGenResultCard from "@/components/VocabGenResultCard";
// 等候回應時顯示的單字卡
import VocabGenResultPlaceholder from "@/components/VocabGenResultPlaceholder";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("English");
  // 所有的單字生成結果清單
  const [vocabList, setVocabList] = useState([]);
  // 是否在等待回應
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    // 當綁定的資料是 [] 時，以下流程只會在第一次渲染時執行
    axios.get("/api/vocab-ai")
      .then(res => {
        setVocabList(res.data.dataList)
      })
      .catch(err => {
        console.log("err:", err);
      });
  }, []);

  const items = vocabList.map(result => {
    return <VocabGenResultCard result={result} key={result.createdAt} />
  })

  function submitHandler(e) {
    e.preventDefault();
    console.log("User Input: ", userInput);
    console.log("Language: ", language);
    const body = { userInput, language };
    console.log("body:", body);
    setIsWaiting(true);
    setUserInput("");
    // TODO: 將body POST到 /api/vocab-ai { userInput: "", language: "" }
    axios.post("/api/vocab-ai", body)
      .then(res => {
        // 前後端對接沒問題時觸發
        // 後端回傳資料存在 res.data 內
        const result = res.data;
        setVocabList([result, ...vocabList]);
        setIsWaiting(false);
      })
      .catch(err => {
        // 出錯時觸發
        alert("出錯了，請稍後再試")
        setIsWaiting(false);
      });
  }

  return (
    <>
      <CurrentFileIndicator filePath="/app/page.js" />
      <PageHeader title="AI Vocabulary Generator" icon={faEarthAmericas} />
      <section>
        <div className="container mx-auto">
          <form onSubmit={submitHandler}>
            <div className="flex">
              <div className="w-3/5 px-2">
                <input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  type="text"
                  className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                  placeholder="Enter a word or phrase"
                  required
                />
              </div>
              <div className="w-1/5 px-2">
                <select
                  className="border-2 w-full block p-3 rounded-lg"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  <option value="English">English</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                </select>
              </div>
              <div className="w-1/5 px-2">
                <GeneratorButton isWaiting={isWaiting} />
              </div>
            </div>
          </form>
        </div>
      </section>
      <section>
        <div className="container mx-auto">
          {isWaiting ? <VocabGenResultPlaceholder /> : null}
          {/* TODO: 顯示AI輸出結果 */}
          {items}
        </div>
      </section>
    </>
  );
}
