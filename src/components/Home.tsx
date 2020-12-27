import { Component, createRef, useEffect, useState } from "react";
import "./Home.scss";
import Encoding from "encoding-japanese";
import { Subscription } from "../models/Subscription";
import { Settings, PageSettings } from "../models/Settings";
import { CommandComponentFactory } from "../models/Command";
import { NavigationCommand } from "./Commands/Navegation";
import { KeywordItem, KeywordsComponent } from "./Commands/Keyword";

const subscription = new Subscription<Settings>();
subscription.subscribe({
  next(context) {
    window.localStorage.setItem("settings", JSON.stringify(context.to));
    console.log("settings saved");
  },
});
const savedSettingsStr = window.localStorage.getItem("settings") || "";

const commands = {
  selected: ["furigana-visibility"],
  available: ["furigana-visibility"],
};
const factory = new CommandComponentFactory();

const Home = function () {
  const [settings, setSettings] = useState(
    savedSettingsStr.trim().length > 0
      ? (JSON.parse(savedSettingsStr) as Settings)
      : new Settings()
  );
  const refTextContent = createRef<HTMLDivElement>();

  const TEXT_CONTENT_KEY = "textContentKey";

  const changeSettings = (to: any) => {
    const oldOne = settings;
    const newOne = { ...oldOne, ...to };
    setSettings(newOne);
    subscription.notifyAll({
      to: newOne,
      from: oldOne,
    });
  };

  const changeBodyFontSizeTo = function (val: number) {
    changeSettings({ fontSize: val });
  };

  useEffect(() => {
    subscription.subscribe({
      next({ from, to }) {
        if (from.fontSize !== to.fontSize) {
          document.body.style.fontSize = to.fontSize + "px";
          console.log("fontsize updated");
        }
      },
    });
  }, []);

  useEffect(() => {
    const textContent = window.localStorage.getItem(TEXT_CONTENT_KEY) || "";
    if (settings.navigation.separator.length > 0) {
      const textContent = window.localStorage.getItem(TEXT_CONTENT_KEY) || "";
      const html = document.createElement("html");
      html.innerHTML = textContent;
      const textContentDOM = refTextContent.current;
      if (textContentDOM) {
        textContentDOM.innerHTML = "";
        const query = html.querySelectorAll(settings.navigation.separator);
        const posI = getTextContentPosI(
          settings.navigation.pageI,
          settings.navigation.length
        );
        for (let index = posI; index < query.length; index++) {
          const item = query[index];
          if (index < posI + settings.navigation.length) {
            textContentDOM.append(item);
          } else {
            break;
          }
        }

        //operacion 2
        //realizarlo con el chain of responability patter
        const keywordList =
          settings.pages[settings.navigation.pageI].keyWordList;
        if (keywordList.length > 0) {
          let finalText = textContentDOM.innerHTML;
          keywordList.forEach((item) => {
            if (item.text.trim().length > 0) {
              finalText = finalText.replaceAll(
                item.text,
                `<span style="background-color: ${item.color};">${item.text}</span>`
              );
            }
          });

          textContentDOM.innerHTML = finalText;
        }
      }
    } else {
      render(
        textContent,
        getTextContentPosI(
          settings.navigation.pageI,
          settings.navigation.length
        ),
        settings.navigation.length
      );
    }
  }, [settings]);

  const render = (fileContents: string, start: number, length?: number) => {
    fileContents = fileContents
      .replace(/［＃\（(.*?.jpg)\）入る］/g, "<img src='$1' title='$1'>") // Insert <img src="..." >
      .replace(/［＃改ページ］/g, "<hr></hr>") // Draw a white line for page changes
      .replace(/《(.*?)》/g, "<span class='furigana'>$1</span>"); // Wrap furigana

    if (refTextContent.current) {
      refTextContent.current.innerHTML = fileContents.substr(start, length);
    }
  };

  const readFile = function (file: File) {
    const reader = new FileReader();

    reader.onload = ({ target }) => {
      const content = new Uint8Array(target?.result as ArrayBuffer);
      const textContent = Encoding.convert(content, {
        to: "UNICODE",
        from: Encoding.detect(content) || undefined,
        type: "string",
      });

      const pos = getTextContentPosI(
        settings.navigation.pageI,
        settings.navigation.length
      );

      render(textContent, pos, settings.navigation.length);
      window.localStorage.setItem(TEXT_CONTENT_KEY, textContent);
    };
    reader.readAsArrayBuffer(file);
  };

  const getTextContentPosI = (i: number, len: number) => i * len;

  const changeSeparator = function (value: string) {
    changeSettings({ separator: value });
  };

  const onResizeHead = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const parent = event.currentTarget.previousElementSibling as HTMLDivElement;
    const parent2 = event.currentTarget.parentElement
      ?.previousElementSibling as HTMLDivElement;

    const xInitial = event.clientY;
    const wInitial = parent.clientHeight;

    window.onselectstart = () => false;
    const onMouseMove = (event2: MouseEvent) => {
      if (parent && parent2) {
        const xFinal = event2.clientY;
        const height = wInitial + (xFinal - xInitial);

        window.requestAnimationFrame(() => {
          parent.style.height = `${height}px`;
          parent2.style.height = `${height}px`;
        });
      }
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", () => {
      window.onselectstart = () => true;
      document.removeEventListener("mousemove", onMouseMove);
    });
  };

  const rightCommandList = () =>
    settings.commandList.filter((item) => item.layout === "right");

  const getCurrentPage = () => settings.pages[settings.navigation.pageI];
  return (
    <div className="home">
      <div className="head">
        <div className="controls-2"></div>
        <div className="controls">
          <div className="container">
            {commands.selected.map((item) => (
              <div className="item" key={item}>
                {factory.createCommand(item)}
              </div>
            ))}
            <NavigationCommand
              onTryToChange={(to) => changeSettings({ navigation: to })}
              navigation={settings.navigation}
            />
            <div className="item">
              <input
                type="file"
                onChange={({ target }) =>
                  target.files?.length ? readFile(target.files[0]) : 1
                }
              />
            </div>
          </div>
          <div className="bar" onMouseDown={onResizeHead}></div>
        </div>

        {/* <div className="item">
                <button type="button" onClick={()=> changeSettings({pageI: settings.pageI - 1}) }>&lt;</button>
                <input className="counter" type="text" value={settings.pageI + 1}/>
                <input onChange={({target}) => changeSettings({length: parseInt(target.value)})} type="text" value={settings.length}/>
                <button type="button"onClick={()=> changeSettings({pageI: settings.pageI + 1}) }>&gt;</button>
            </div>
            <div className="item">
            <button type="button" onClick={ ()=> changeBodyFontSizeTo(settings.fontSize - 1)}>-</button>
            <input type="text" onChange={ ({target})=> changeBodyFontSizeTo(parseInt(target.value) || 0)}  value={settings.fontSize} style={{ width: "25px"}}/>
            <button type="button" onClick={ ()=> changeBodyFontSizeTo(settings.fontSize + 1)}>+</button>
            </div>

            <label className="item">
                <input onChange= { ({target}) => refTextContent.current?.setAttribute("contentEditable",target.checked.toString())  } type="checkbox"/>
                Edit text.
            </label>
            <div className="item">
                <label>Separator&nbsp;
                <input onChange={({target}) => changeSeparator(target.value)}  type="text" className="counter" value={settings.separator}/>
                </label>
            </div>
        */}
      </div>

      <div className="body">
        <div className="left"></div>
        <div
          onMouseUpCapture={(event) => {
            const textSelected = window.getSelection()?.toString();
            if (textSelected && textSelected.length > 0) {
              const page = getCurrentPage();
              page.keyWordList[page.keyWordList.length - 1].text = textSelected;
              changeSettings({ pages: { ...settings.pages } });
            }
          }}
          className="mid"
          ref={refTextContent}
        ></div>
        <div className="right">
          <div
            onDragStart={() => false}
            onMouseDown={(event) => {
              const parent = event.currentTarget
                .nextElementSibling as HTMLElement;
              const xInitial = event.clientX;
              const wInitial = parent.clientWidth;
              window.onselectstart = () => false;
              const onMouseMove = (event2: MouseEvent) => {
                if (parent) {
                  const xFinal = event2.clientX;
                  const width = wInitial + (-xFinal + xInitial);
                  // console.log([xInitial,xFinal,width]);
                  window.requestAnimationFrame(
                    () => (parent.style.width = `${width}px`)
                  );
                }
              };
              document.addEventListener("mousemove", onMouseMove);
              document.addEventListener("mouseup", () => {
                window.onselectstart = () => true;
                document.removeEventListener("mousemove", onMouseMove);
              });
            }}
            className="bar"
          >
            &nbsp;
          </div>
          <div className="controls">
            <div className="floating">
              <div className="item">
                <KeywordsComponent
                  onStateChanged={(to) => {
                    const pages = settings.pages;
                    const index = settings.navigation.pageI;
                    if (!pages[index]) {
                      pages[index] = new PageSettings();
                    }
                    pages[index].keyWordList = to;
                    changeSettings({ pages });
                  }}
                  keywordList={
                    (settings.pages &&
                      settings.pages[settings.navigation.pageI] &&
                      settings.pages[settings.navigation.pageI].keyWordList) ||
                    []
                  }
                />
              </div>
              {/* <div className="item">
                            <KeywordItem keyword={ {text: settings.textSelected, color: "#808080", isGlobal: false}}/>
                            <button type="button">
                                <span className="icon">ddd</span>
                            </button>
                        </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
