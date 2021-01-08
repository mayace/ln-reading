// import Encoding from "encoding-japanese";
import { cloneDeep, isEqual } from "lodash";
import React, { ReactNode } from "react";
import { CommandProccesor, ICommand } from "../models/Command";
import {
  DocumentSettings,
  KeywordSettings,
  NavigationSettings, PageSettings, Settings
} from "../models/Settings";
import { Subscription } from "../models/Subscription";
import { FontSizeCommand } from "./Commands/FontSize";
import { KeywordListComponent } from "./Commands/Keyword";
import { NavigationCommand } from "./Commands/Navegation";
import {
  ChangeFontSizeCommand,
  ChangeTextCommand,
  DocumentDOM,
  HighLightTextCommand,
  IKeyword
} from "./DocumentDOM";
import "./Home.scss";


export interface IDimension {
  height: number;
  width: number;
}
export class UpdateTopHeightCommand implements ICommand {
  constructor(private home: HomeView, private params: IDimension) {}
  execute(): void {
    this.home.updateTopHeight(this.params.height);
  }
}
export class UpdateRightWidthCommand implements ICommand {
  constructor(private home: HomeView, private params: IDimension) {}
  execute(): void {
    this.home.updateRightWidth(this.params.width);
  }
}

export interface IHomeViewProps {
  contentStorageKey: string;
}

export class HomeView extends React.Component<IHomeViewProps, Settings> {
  state = new Settings();
  beforeSettingsSubscription = new Subscription<Settings>();
  settingsSubscription = new Subscription<Settings>();
  delayTimeoutId: number | undefined;
  documentInstance = React.createRef<DocumentDOM>();
  commandProccesor = new CommandProccesor();

  get currentPage(): PageSettings {
    const {
      pages,
      navigation: { pageI },
    } = this.state;
    return pages[pageI] || new PageSettings();
  }

  constructor(props: IHomeViewProps) {
    super(props);

    this.onResizeHead = this.onResizeHead.bind(this);
    this.onResizeRight = this.onResizeRight.bind(this);

    // recover setting
    const savedSettingsStr = window.localStorage.getItem("settings")?.trim() || "";
    if (savedSettingsStr) {
      this.state = { ...this.state, ...JSON.parse(savedSettingsStr) };
    }

    // subscriptions
    const delaySaveSettigns = 1000;
    let delaySaveSettingsId: number | undefined;
    this.settingsSubscription.subscribe({
      next({ to }) {
        window.clearTimeout(delaySaveSettingsId);
        delaySaveSettingsId = window.setTimeout(() => {
          window.localStorage.setItem("settings", JSON.stringify(to));
          console.log("settings saved");
        }, delaySaveSettigns);
      },
    });

    // document
    let delayHighlightId: number | undefined;
    this.settingsSubscription.subscribe({
      next: ({
        to: {
          document: { fontSize },
          pages,
          navigation: { pageI, separator, length },
        },
        from,
      }) => {
        if (fontSize !== from.document.fontSize) {
          this.updateDocumentFontSize(fontSize);
        }

        const separatorChanged = separator !== from.navigation.separator;
        const pageIChanged = pageI !== from.navigation.pageI;
        const lengthChanged = length !== from.navigation.length;
        if (separatorChanged || pageIChanged || lengthChanged) {
          this.updateDocumentTextContent(this.props.contentStorageKey, {
            pageI,
            length,
            separator,
          });
        }

        const currentPage = pages[pageI];
        const previousPage = from.pages[from.navigation.pageI];
        // console.log([currentPage, previousPage]);
        if (!isEqual(currentPage?.keyWordList, previousPage?.keyWordList)) {
          window.clearTimeout(delayHighlightId);
          delayHighlightId = window.setTimeout(() => {
            this.updateDocumentHighlightText(currentPage?.keyWordList || []);
            console.log("update highlights");
          }, 500);
        }
      },
    });

    // view
    this.settingsSubscription.subscribe({
      next: ({
        to: {
          view: { top, right },
        },
        from,
      }) => {
        if (top.height !== from.view.top.height) {
          this.updateTopHeight(top.height);
        }

        if (right.width !== from.view.right.width) {
          this.updateRightWidth(right.width);
        }
      },
    });
  }
  // const [settings, setSettings] = useState(
  //   savedSettingsStr.trim().length > 0 ? (JSON.parse(savedSettingsStr) as Settings) : new Settings()
  // );
  // const refTextContent = useRef<HTMLDivElement>(null);
  // const headRef = useRef<HTMLDivElement>(null);
  // let timeoutId: number;
  updateSettings<K extends keyof Settings>(to: Pick<Settings, K>): void {
    const from = cloneDeep(this.state);
    this.setState(to, () => {
      this.settingsSubscription.notifyAll({ to: this.state, from });
    });

    // const oldOne = this.state;
    // const newOne = { ...cloneDeep(oldOne), ...to };

    // this.beforeSettingsSubscription.notifyAll({ to: newOne, from: oldOne });
    // window.clearTimeout(this.delayTimeoutId);
    // this.delayTimeoutId = window.setTimeout(() => {
    //   // const ti = new Date();
    //   this.setState(to);
    //   // console.log(new Date().getTime() - ti.getTime());
    //   this.settingsSubscription.notifyAll({
    //     to: newOne,
    //     from: oldOne,
    //   });
    // }, 200);
  }
  // useEffect(() => {
  //   subscription.subscribe({
  //     next({ to, from }) {
  //       if (from.document.fontSize !== to.document.fontSize) {
  //         const instance = documentInstance.current;
  //         if (instance) {
  //           commandProccesor.place(
  //             new ChangeFontSizeCommand(instance, { fontSize: to.document.fontSize })
  //           );
  //         }
  //       }
  //       commandProccesor.proccess();
  //     },
  //   });
  //   beforeSettingsSubs.subscribe({
  //     next({ from, to }) {
  //       const toHeight = to.view?.top.height || 0;
  //       const fromHeight = from.view?.top.height || 0;
  //       // console.log([toHeight,fromHeight])
  //       if (toHeight !== fromHeight) {
  //         const queryResult = headRef.current?.querySelectorAll(".controls-2, .container") || [];
  //         const queryRestult2 = document.querySelector(".right .floating") as HTMLDivElement;
  //         if (queryResult?.length > 0) {
  //           window.requestAnimationFrame(() => {
  //             queryResult.forEach(
  //               (item: Element) => ((item as HTMLDivElement).style.height = `${toHeight}px`)
  //             );
  //           });
  //         }
  //         if (queryRestult2) {
  //           window.requestAnimationFrame(
  //             () => (queryRestult2.style.height = `calc(100vh - ${toHeight}px)`)
  //           );
  //         }
  //       }
  //       const toWidth = to.view?.right.width || 0;
  //       const fromWidth = from.view?.right.width || 0;
  //       if (toWidth !== fromWidth) {
  //         const queryResult = document.querySelector(".right .controls") as HTMLDivElement;
  //         if (queryResult) {
  //           window.requestAnimationFrame(() => (queryResult.style.width = `${toWidth}px`));
  //         }
  //       }
  //     },
  //   });
  // }, []);

  updateRightWidth(width: number): void {
    const queryResult = document.querySelector(".right .controls") as HTMLElement;
    if (queryResult) {
      window.requestAnimationFrame(() => (queryResult.style.width = `${width}px`));
    }
  }

  updateTopHeight(to: number): void {
    const queryResult = document.querySelectorAll(".controls-2, .head .container") || [];
    const queryRestult2 = document.querySelector(".right .floating") as HTMLElement;

    const list: (() => void)[] = [];
    if (queryResult?.length > 0) {
      list.push(() => {
        queryResult.forEach((item: Element) => ((item as HTMLElement).style.height = `${to}px`));
      });
    }
    if (queryRestult2) {
      list.push(() => (queryRestult2.style.height = `calc(100vh - ${to}px)`));
    }
    if (list.length > 0) {
      window.requestAnimationFrame(() => list.forEach((item) => item()));
    }
  }

  componentDidMount(): void {
    this.updateDocumentFontSize(this.state.document.fontSize);
    this.updateViewSettings();
    this.updateDocumentTextContent(this.props.contentStorageKey, this.state.navigation);
    this.updateDocumentHighlightText(this.currentPage?.keyWordList || []);
  }

  updateDocumentHighlightText(keywordList: IKeyword[]): void {
    const instance = this.documentInstance.current;
    if (instance) {
      this.commandProccesor.place(new HighLightTextCommand(instance, { keywordList }));
      this.commandProccesor.proccess();
    }
  }

  updateDocumentFontSize(fontSize: number): void {
    const instance = this.documentInstance.current;
    if (instance) {
      this.commandProccesor.place(new ChangeFontSizeCommand(instance, { fontSize }));
      this.commandProccesor.proccess();
    }
  }

  updateViewSettings(): void {
    const { view } = this.state;
    this.commandProccesor.place(
      new UpdateTopHeightCommand(this, { height: view.top.height, width: 0 })
    );
    this.commandProccesor.place(
      new UpdateRightWidthCommand(this, { height: 0, width: view.right.width })
    );

    this.commandProccesor.proccess();
  }

  updateDocumentTextContent(keyStorage: string, navigation: NavigationSettings): void {
    const textContent = window.localStorage.getItem(keyStorage)?.trim() || "";
    const instance = this.documentInstance.current;

    if (textContent.length > 0 && instance) {
      const html = document.createElement("html");
      html.innerHTML = textContent;
      const query = html.querySelectorAll(navigation.separator);
      const posI = this.getTextContentPosI(navigation.pageI, navigation.length);
      const elementList = [];
      for (let index = posI; index < query.length; index++) {
        const item = query[index];
        if (index < posI + navigation.length) {
          elementList.push(item);
        } else {
          break;
        }
      }

      this.commandProccesor.place(new ChangeTextCommand(instance, { elementList }));
      this.commandProccesor.proccess();
    }
  }

  // const render = (fileContents: string, start: number, length?: number) => {
  //   fileContents = fileContents
  //     .replace(/［＃\（(.*?.jpg)\）入る］/g, "<img src='$1' title='$1'>") // Insert <img src="..." >
  //     .replace(/［＃改ページ］/g, "<hr></hr>") // Draw a white line for page changes
  //     .replace(/《(.*?)》/g, "<span class='furigana'>$1</span>"); // Wrap furigana
  //   if (refTextContent.current) {
  //     refTextContent.current.innerHTML = fileContents.substr(start, length);
  //   }
  // };
  readFile(): void {
    // const reader = new FileReader();
    // reader.onload = ({ target }) => {
    //   const content = new Uint8Array(target?.result as ArrayBuffer);
    //   const textContent = Encoding.convert(content, {
    //     to: "UNICODE",
    //     from: Encoding.detect(content) || undefined,
    //     type: "string",
    //   });
    //   const pos = getTextContentPosI(settings.navigation.pageI, settings.navigation.length);
    //   render(textContent, pos, settings.navigation.length);
    //   window.localStorage.setItem(TEXT_CONTENT_KEY, textContent);
    // };
    // reader.readAsArrayBuffer(file);
  }
  getTextContentPosI = (i: number, len: number): number => i * len;

  onResizeHead(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const parent = event.currentTarget.previousElementSibling as HTMLDivElement;
    const parent2 = event.currentTarget.parentElement?.previousElementSibling as HTMLDivElement;
    const xInitial = event.clientY;
    const wInitial = parent.clientHeight;
    window.onselectstart = () => false;
    const onMouseMove = (event2: MouseEvent) => {
      if (parent && parent2) {
        const xFinal = event2.clientY;
        const height = wInitial + (xFinal - xInitial);
        const view = cloneDeep(this.state.view);
        view.top.height = Math.max(0, height);
        this.updateSettings({ view });
      }
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", () => {
      window.onselectstart = () => true;
      document.removeEventListener("mousemove", onMouseMove);
    });
  }

  onResizeRight(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const parent = event.currentTarget.nextElementSibling as HTMLElement;
    const xInitial = event.clientX;
    const wInitial = parent.clientWidth;
    window.onselectstart = () => false;
    const onMouseMove = (event2: MouseEvent) => {
      if (parent) {
        const xFinal = event2.clientX;
        const width = wInitial + (-xFinal + xInitial);
        const view = cloneDeep(this.state.view);
        view.right.width = width;
        this.updateSettings({ view });
      }
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", () => {
      window.onselectstart = () => true;
      document.removeEventListener("mousemove", onMouseMove);
    });
  }

  onDocumentTextSelected(selection: string): void {
    const {
      navigation: { pageI },
    } = this.state;
    const pages = cloneDeep(this.state.pages);

    const { keyWordList } = pages[pageI] || new PageSettings();

    const lastIndex = Math.max(0, keyWordList.length - 1);
    keyWordList[lastIndex].text = selection;

    this.updateSettings({ pages });
  }

  render(): ReactNode {
    const { document, navigation, pages } = this.state;
    const { pageI } = navigation;
    const currentPage = pages[pageI] || new PageSettings();
    if (!pages[pageI]) {
      pages[pageI] = currentPage;

      currentPage.keyWordList.push(new KeywordSettings());
      currentPage.keyWordList[0].color = Math.floor(Math.random() * 16777215).toString(16);
    }

    return (
      <div className="home">
        <div className="head">
          <div className="controls-2" />
          <div className="controls">
            <div className="container">
              <div className="item">
                <FontSizeCommand
                  document={document || new DocumentSettings()}
                  onTryToChange={(to) => this.updateSettings({ document: to })}
                />
              </div>
              <div className="item">
                <NavigationCommand
                  onTryToChange={(to) => this.updateSettings({ navigation: to })}
                  navigation={navigation}
                />
              </div>
              <div className="item">
                <input
                  type="file"
                  onChange={({ target }) =>
                    target.files?.length ? this.readFile() : 1
                  }
                />
              </div>
            </div>
            <div className="bar" onMouseDown={this.onResizeHead} />
          </div>
        </div>
        <div className="body">
          <div className="left" />
          <div className="mid">
            <div className="container">
              <DocumentDOM
                ref={this.documentInstance}
                KeywordList={this.currentPage.keyWordList}
                onTextSelected={(selection) => this.onDocumentTextSelected(selection)}
              />
            </div>
          </div>
          <div className="right">
            <div
              onDragStart={() => false}
              onMouseDown={(event) => this.onResizeRight(event)}
              className="bar"
            >
              &nbsp;
            </div>
            <div className="controls">
              <div className="floating">
                <div className="item">
                  <KeywordListComponent
                    onStateChanged={(to) => {
                      const newPages = cloneDeep(pages);
                      newPages[pageI].keyWordList = to;
                      this.updateSettings({ pages: newPages });
                    }}
                    keywordList={currentPage.keyWordList}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
