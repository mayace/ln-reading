// import Encoding from "encoding-japanese";
import { cloneDeep } from "lodash";
import React, { ReactNode } from "react";
import { CommandProccesor } from "../../models/Command";
import { KeywordSettings } from "../../models/Settings";
import { NavigationSettings } from "../../models/NavigationSettings";
import { DocumentSettings } from "../../models/DocumentSettings";

import { IContext, Subscription } from "../../models/Subscription";
import { FontSizeCommand } from "../Commands/FontSize";
import { KeywordListComponent } from "../Commands/KeywordListComponent";
import { NavigationCommand } from "../Commands/Navegation";
import { IReadingKeywordItem } from "../explorer/IReadingKeywordItem";
import { FeedItem } from "../explorer/FeedItem";
import { DocumentDOM } from "./DocumentDOM/DocumentDOM";
import { IKeyword } from "./DocumentDOM/IKeyword";
import { HighLightTextCommand } from "./DocumentDOM/HighLightTextCommand";
import { ChangeTextCommand } from "./DocumentDOM/ChangeTextCommand";
import { ChangeFontSizeCommand } from "./DocumentDOM/ChangeFontSizeCommand";
import { IReadingProps } from "./IReadingProps";
import { ReadingState } from "./ReadingState";
import { ReadingSettings } from "./ReadingSettings";
import { UpdateRightWidthCommand } from "./UpdateRightWidthCommand";
import { UpdateTopHeightCommand } from "./UpdateTopHeightCommand";
import { v4 as uuidv4 } from "uuid";
import { Subject } from "rxjs";
import { FuriganaVisibilityCommand } from "../Commands/FuriganaVisibilityCommand";
import "./Reading.scss";

export class ReadingComponent extends React.Component<IReadingProps, ReadingState> {
  beforeSettingsSubscription = new Subscription<ReadingSettings>();
  settingsSubscription = new Subscription<IContext<ReadingSettings>>();
  delayTimeoutId: number | undefined;
  documentInstance = React.createRef<DocumentDOM>();
  commandProccesor = new CommandProccesor();

  feedItemSubscription = new Subscription<IContext<FeedItem>>();

  keywordListSubject = new Subject<KeywordSettings[]>();

  // get currentPage(): PageSettings {
  //   const {
  //     readingSettings: {
  //       pages,
  //       navigation: { pageI },
  //     },
  //   } = this.state;
  //   return pages[pageI] || new PageSettings();
  // }

  constructor(props: IReadingProps) {
    super(props);
    this.settingsSubscription.subscribe({
      next: ({ to, from }) => {
        this.props.readingService.settingsService.update(to.id, to).then(() => {
          if (to.document.withFurigana !== from.document.withFurigana) {
            this.updateFuriganaVisibility(to.document.withFurigana);
          }
        });
      },
    });

    this.state = new ReadingState();
    this.onResizeHead = this.onResizeHead.bind(this);
    this.onResizeRight = this.onResizeRight.bind(this);

    // recover setting
    // const savedSettingsStr = window.localStorage.getItem("settings")?.trim() || "";
    // if (savedSettingsStr) {
    //   this.state = { ...this.state, ...JSON.parse(savedSettingsStr) };
    // }

    // subscriptions
    // const delaySaveSettigns = 1000;
    // let delaySaveSettingsId: number | undefined;
    // this.settingsSubscription.subscribe({
    //   next({ to }) {
    //     window.clearTimeout(delaySaveSettingsId);
    //     delaySaveSettingsId = window.setTimeout(() => {
    //       window.localStorage.setItem("settings", JSON.stringify(to));
    //       console.log("settings saved");
    //     }, delaySaveSettigns);
    //   },
    // });

    // document
    // this.settingsSubscription.subscribe({
    //   next: ({
    //     to: {
    //       document: { fontSize },
    //       navigation: { pageI, separator, length },
    //     },
    //     from,
    //   }) => {
    //     // if (fontSize !== from.document.fontSize) {
    //     //   this.updateDocumentFontSize(fontSize);
    //     // }

    //     // const separatorChanged = separator !== from.navigation.separator;
    //     // const pageIChanged = pageI !== from.navigation.pageI;
    //     // const lengthChanged = length !== from.navigation.length;
    //     // if (separatorChanged || pageIChanged || lengthChanged) {
    //     //   this.updateDocumentTextContent(this.props.contentStorageKey, {
    //     //     pageI,
    //     //     length,
    //     //     separator,
    //     //   });
    //     // }

    //     // hightlight fired
    //     // let delayHighlightId: number | undefined;
    //     // const currentPage = pages[pageI];
    //     // const previousPage = from.pages[from.navigation.pageI];
    //     // // console.log([currentPage, previousPage]);
    //     // if (!isEqual(currentPage?.keyWordList, previousPage?.keyWordList)) {
    //     //   window.clearTimeout(delayHighlightId);
    //     //   delayHighlightId = window.setTimeout(() => {
    //     //     this.updateDocumentHighlightText(currentPage?.keyWordList || []);
    //     //     console.log("update highlights");
    //     //   }, 500);
    //     // }
    //   },
    // });

    // view
    // this.settingsSubscription.subscribe({
    //   next: ({
    //     to: {
    //       view: { top, right },
    //     },
    //     from,
    //   }) => {
    //     if (top.height !== from.view.top.height) {
    //       this.updateTopHeight(top.height);
    //     }

    //     if (right.width !== from.view.right.width) {
    //       this.updateRightWidth(right.width);
    //     }
    //   },
    // });
  }
  componentDidMount(): void {
    const {
      bookmarkService,
      feedItemService,
      keywordService,
      settingsService,
    } = this.props.readingService;

    settingsService
      .getAll((item: unknown, index: number) => index === 0)
      .then((body) => {
        if (body.length > 0) {
          const readingSettings = body[0];
          return this.updateState({ readingSettings }).then(() => readingSettings);
        }
        const { readingSettings } = this.state;
        readingSettings.id = uuidv4();
        return settingsService.create(readingSettings).then(() => readingSettings);
      })
      .then((settings) => {
        this.updateFuriganaVisibility(settings.document.withFurigana);
      });

    bookmarkService.read().then(({ selectedGuid }) => {
      if (selectedGuid) {
        feedItemService.get(selectedGuid).then((feedItem) => {
          // console.log([selectedGuid, feedItem]);
          if (feedItem) {
            keywordService
              .getAll(
                (item: KeywordSettings) =>
                  feedItem.keywordList.findIndex((jtem) => jtem.keywordId === item.id) >= 0,
              )
              .then((keywordList) => {
                Promise.all([
                  this.updateState({ keywordList }),
                  this.updateState({ feedItem }),
                ]).then(() => {
                  const nodeList = this.getNodeList(
                    selectedGuid,
                    this.state.readingSettings.navigation,
                  );
                  this.updateState({ nodeList });
                  this.updateDocumentTextContent(selectedGuid || "", {
                    ...this.state.readingSettings.navigation,
                    separator: "p",
                  });
                });
              });
          }
        });
      }
      // this.updateDocumentFontSize(this.state.readingSettings.document.fontSize);
      // this.updateViewSettings();

      // this.updateDocumentHighlightText(this.currentPage?.keyWordList || []);
    });
  }

  getKeywordList(keywordList: IReadingKeywordItem[]): Promise<KeywordSettings[]> {
    return this.props.readingService.keywordService.getAll((item: KeywordSettings) =>
      keywordList.find((jtem) => jtem.keywordId === item.id),
    );
  }

  // const [settings, setSettings] = useState(
  //   savedSettingsStr.trim().length > 0 ? (JSON.parse(savedSettingsStr) as Settings) : new Settings()
  // );
  // const refTextContent = useRef<HTMLDivElement>(null);
  // const headRef = useRef<HTMLDivElement>(null);
  // let timeoutId: number;
  updateSettings<K extends keyof ReadingSettings>(to: Pick<ReadingSettings, K>): void {
    const from = cloneDeep(this.state.readingSettings);
    this.setState({ readingSettings: { ...this.state.readingSettings, ...to } }, () => {
      this.settingsSubscription.notifyAll({ to: this.state.readingSettings, from });
    });

    //old version
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

  updateState<k extends keyof ReadingState>(change: Pick<ReadingState, k>): Promise<void> {
    return new Promise((resolve) => {
      this.setState(change, resolve);
    });
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
  updateFuriganaVisibility(visible: boolean): void {
    this.commandProccesor.place(new FuriganaVisibilityCommand(visible));
    this.commandProccesor.proccess();
  }

  updateViewSettings(): void {
    const { view } = this.state.readingSettings;
    this.commandProccesor.place(
      new UpdateTopHeightCommand(this, { height: view.top.height, width: 0 }),
    );
    this.commandProccesor.place(
      new UpdateRightWidthCommand(this, { height: 0, width: view.right.width }),
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

  getNodeList(id: string, navigation: NavigationSettings): Node[] {
    const rawText = window.localStorage.getItem(id)?.trim() || "";

    const html = document.createElement("html");
    html.innerHTML = rawText;
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

    return elementList;
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
        const view = cloneDeep(this.state.readingSettings.view);
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
        const view = cloneDeep(this.state.readingSettings.view);
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

  onDocumentTextSelected(selectedText: string): void {
    this.updateState({ selectedText });
    // const {
    //   readingSettings: {
    //     navigation: { pageI },
    //   },
    // } = this.state;
    // const pages = cloneDeep(this.state.readingSettings.pages);

    // const { keyWordList } = pages[pageI] || new PageSettings();

    // const lastIndex = Math.max(0, keyWordList.length - 1);
    // keyWordList[lastIndex].text = selection;

    // this.updateSettings({ pages });
  }

  // createKeyword(text: string): void {
  //   const { keywordService } = this.props;
  //   const {
  //     feedItem,
  //     readingSettings: {
  //       navigation: { pageI },
  //     },
  //   } = this.state;

  //   keywordService
  //     .get(text)
  //     .then((item) => {
  //       if (!item) {
  //         item = new KeywordSettings();
  //         item.text = text;
  //         item.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  //         return keywordService.create(item).then(() => item);
  //       }

  //       return item;
  //     })
  //     .then((item) => {
  //       if (feedItem && item) {
  //         if (!feedItem.keywordList) {
  //           feedItem.keywordList = [];
  //         }

  //         const found = feedItem.keywordList.find((jtem) => jtem.keywordId === item.id);
  //         if (!found) {
  //           feedItem.keywordList.push({ keywordId: item.id, pageIndex: pageI });
  //           const { feedItemService } = this.props;
  //           return feedItemService.get(feedItem.guid).then((body) => {
  //             if (body) {
  //               this.props.feedItemService.update(feedItem.guid, feedItem);
  //             } else {
  //               this.props.feedItemService.create(feedItem);
  //             }
  //           });
  //         }
  //       }
  //     });
  // }

  onKeywordChange(item: KeywordSettings): void {
    const { keywordList } = this.state;
    this.props.readingService.keywordService.update(item.id, item).then(() => {
      const jndex = keywordList.findIndex((jtem) => jtem.id === item.id);
      if (jndex >= 0) {
        keywordList[jndex] = item;
        return this.updateState({ keywordList });
      }
    });
  }
  onKeywordCreate(item: KeywordSettings): void {
    const {
      feedItem,
      readingSettings: { navigation },
    } = this.state;
    const { keywordService, feedItemService } = this.props.readingService;

    keywordService
      .getAll((jtem: KeywordSettings) => jtem.text === item.text)
      .then((jtem) => {
        return jtem.length > 0 ? jtem[0] : undefined;
      })
      .then((jtem) => {
        if (!jtem) {
          item.id = uuidv4();
          return keywordService.create(item).then(() => item);
        }
        return jtem;
      })
      .then((jtem) => {
        if (feedItem) {
          let kFound = feedItem.keywordList.find((ktem) => ktem.keywordId === jtem.id);
          if (!kFound) {
            kFound = { keywordId: jtem.id, pageIndex: navigation.pageI };
            feedItem.keywordList.push(kFound);
            return feedItemService.update(feedItem.guid, feedItem).then(() => {
              return this.updateState({ feedItem }).then(() => jtem);
            });
          }
          throw "It's already on your current list.";
        }
      })
      .then((jtem) => {
        const { keywordList } = this.state;
        if (jtem) {
          keywordList.push(jtem);
          return this.updateState({ keywordList });
        }
      })
      .catch((reason) => alert(reason));
  }

  onKeywordDelete(index: number): void {
    const { keywordList, feedItem } = this.state;

    const item = keywordList[index];
    const jndex = feedItem.keywordList.findIndex((jtem) => (jtem.keywordId = item.id));

    keywordList.splice(index, 1);
    feedItem.keywordList.splice(jndex, 1);

    this.props.readingService.feedItemService.update(feedItem.guid, feedItem).then(() => {
      this.updateState({ feedItem });
      this.updateState({ keywordList });
    });
  }

  render(): ReactNode {
    const {
      readingSettings: { document, navigation },
      keywordList,
      nodeList,
      selectedText,
    } = this.state;

    return (
      <div className="reading-component">
        <div className="columns">
          <div className="column">
            <FontSizeCommand
              document={document || new DocumentSettings()}
              onTryToChange={(to) => this.updateSettings({ document: to })}
            />
          </div>
          <div className="column">
            <label className="checkbox">
              <input
                checked={document.withFurigana}
                onChange={({ target }) =>
                  this.updateSettings({ document: { ...document, withFurigana: target.checked } })
                }
                type="checkbox"
              />
              Furigana
            </label>
          </div>
          <div className="column">
            <NavigationCommand
              onTryToChange={(to) => this.updateSettings({ navigation: to })}
              navigation={navigation}
            />
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <DocumentDOM
              fontSize={document.fontSize}
              color="#FFCC33"
              background="#280000"
              unitSize="px"
              ref={this.documentInstance}
              KeywordList={keywordList}
              nodeList={nodeList}
              onTextSelected={(selection) => this.onDocumentTextSelected(selection)}
            />
          </div>
          <div className="column is-3">
            <KeywordListComponent
              defaultText={selectedText}
              onSelect={(selectedKeyword) => this.updateState({ selectedKeyword })}
              onChange={(item) => this.onKeywordChange(item)}
              onCreate={(item) => this.onKeywordCreate(item)}
              onDelete={(index) => this.onKeywordDelete(index)}
              keywordList={keywordList}
            />
          </div>
        </div>
      </div>
    );
  }

  // oldLayout(): ReactNode {
  //   const {
  //     readingSettings: { document, navigation },
  //     keywordList,
  //     selectedText,
  //   } = this.state;
  //   return (
  //     <div className="home">
  //       <div className="head">
  //         <div className="controls-2" />
  //         <div className="controls">
  //           <div className="container">
  //             <div className="item">
  //               <FontSizeCommand
  //                 document={document || new DocumentSettings()}
  //                 onTryToChange={(to) => this.updateSettings({ document: to })}
  //               />
  //             </div>
  //             <div className="item">
  //               <NavigationCommand
  //                 onTryToChange={(to) => this.updateSettings({ navigation: to })}
  //                 navigation={navigation}
  //               />
  //             </div>
  //             <div className="item">
  //               <input
  //                 type="file"
  //                 onChange={({ target }) => (target.files?.length ? this.readFile() : 1)}
  //               />
  //             </div>
  //           </div>
  //           <div className="bar" onMouseDown={this.onResizeHead} />
  //         </div>
  //       </div>
  //       <div className="body">
  //         <div className="left" />
  //         <div className="mid">
  //           <div className="container">
  //             <DocumentDOM
  //               fontSize={24}
  //               color="#FFCC33"
  //               background="#280000"
  //               unitSize="px"
  //               ref={this.documentInstance}
  //               KeywordList={[]}
  //               onTextSelected={(selection) => this.onDocumentTextSelected(selection)}
  //             />
  //           </div>
  //         </div>
  //         <div className="right">
  //           <div
  //             onDragStart={() => false}
  //             onMouseDown={(event) => this.onResizeRight(event)}
  //             className="bar"
  //           >
  //             &nbsp;
  //           </div>
  //           <div className="controls">
  //             <div className="floating">
  //               <div className="item">
  //                 <div className="field has-addons">
  //                   <div className="control is-expanded">
  //                     <input
  //                       value={this.state.selectedText}
  //                       onChange={({ target }) => this.updateState({ selectedText: target.value })}
  //                       type="text"
  //                       className="input"
  //                     />
  //                   </div>
  //                   <div className="control">
  //                     <button
  //                       onClick={() => this.createKeyword(this.state.selectedText)}
  //                       type="button"
  //                       className="button is-primary"
  //                     >
  //                       <span className="icon">
  //                         <i className="fas fa-plus"></i>
  //                       </span>
  //                       <span>Create</span>
  //                     </button>
  //                   </div>
  //                 </div>

  //                 <KeywordListComponent
  //                   defaultText={selectedText}
  //                   onSelect={() => 1}
  //                   onChange={() => {
  //                     // const newPages = cloneDeep(pages);
  //                     // newPages[pageI].keyWordList = to;
  //                     // this.updateSettings({ pages: newPages });
  //                   }}
  //                   keywordList={keywordList}
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
}
