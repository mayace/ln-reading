import { createRef, useEffect, useState } from "react"
import "./Home.scss";
import Encoding from "encoding-japanese";
import { Subscription } from "../models/Subscription";
import { LrSettings } from "../models/LrSettings";
import { CommandComponentFactory } from "../models/Command";


const subscription = new Subscription<LrSettings>();
const commands ={
    selected: ["furigana-visibility"],
    available: ["furigana-visibility"],
}
const factory = new CommandComponentFactory();





const Home = function(this: any){
    
    const [settings,setSettings] = useState(new LrSettings()); 
    const refTextContent  =createRef<HTMLDivElement>();

    const TEXT_CONTENT_KEY = "textContentKey";

    const changeSettings = (to:any) =>{
        const oldOne = settings;
        const newOne = {...oldOne,...to};
        setSettings(newOne);
        subscription.notifyAll({
            to: newOne,
            from: oldOne 
        });
    }

    const changeBodyFontSizeTo = function(val : number){
        changeSettings({fontSize: val});
    }

   useEffect( ()=>{
        subscription.subscribe({
            next(context){
                window.localStorage.setItem("settings", JSON.stringify(context.to));
                console.log("settings saved");
            }
        });

        subscription.subscribe({
            next({from, to}){
              if(from.fontSize !== to.fontSize){
                document.body.style.fontSize = to.fontSize + "px";
                console.log("fontsize updated");
              }
            }
        });

        const savedStrSettings= window.localStorage.getItem("settings");
       if(savedStrSettings){
           changeSettings(JSON.parse(savedStrSettings));
       }
   },[]);

   useEffect(()=>{
    const textContent = window.localStorage.getItem(TEXT_CONTENT_KEY) || "";
    if(settings.separator.length > 0){
        const textContent = window.localStorage.getItem(TEXT_CONTENT_KEY) || "";
        const html = document.createElement("html");
        html.innerHTML = textContent;
        const textContentDOM = refTextContent.current;
        if(textContentDOM){
            textContentDOM.innerHTML = "";
            const query =  html.querySelectorAll(settings.separator);
            const posI = getTextContentPosI(settings.pageI,settings.length);
            for (let index = posI; index < query.length; index++) {
                const item = query[index];
                if(index < posI +  settings.length){
                    textContentDOM.append(item);
                } else {
                    break;
                }
            }
        }
    } else{
        render(textContent,getTextContentPosI(settings.pageI, settings.length),settings.length);
    }
   },[settings]);

   const render = (fileContents : string, start: number, length?: number ) => {
    fileContents = fileContents
      .replace(/［＃\（(.*?.jpg)\）入る］/g, "<img src='$1' title='$1'>") // Insert <img src="..." >
      .replace(/［＃改ページ］/g, "<hr></hr>") // Draw a white line for page changes
      .replace(/《(.*?)》/g, "<span class='furigana'>$1</span>"); // Wrap furigana

    if(refTextContent.current){
        refTextContent.current.innerHTML = fileContents.substr(start,length);
    }
  };


    const readFile = function(file:File){
       const reader = new FileReader();

       reader.onload = ({ target})=>{
            const content = new Uint8Array( target?.result as ArrayBuffer);
            const textContent = Encoding.convert(content,
                {
                  to: "UNICODE",
                  from: Encoding.detect(content) || undefined,
                  type: 'string',
                });

                const pos = getTextContentPosI(settings.pageI, settings.length);

                render(textContent,pos,settings.length);
                window.localStorage.setItem(TEXT_CONTENT_KEY,textContent);
        }
        reader.readAsArrayBuffer(file);
    }

    const getTextContentPosI = (i:number,len:number) => i * len;

    const changeSeparator = function(value: string){
        changeSettings({separator: value});
    }

 

    return <div className="home">
        <div>
            
        <div className="head">
            {commands.selected.map(item => (<div className="item"  key={item}>{factory.createCommand(item)}</div>))}
            
            <div className="item">
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
            <div className="item">
                <input type="file" onChange={({target}) => target.files?.length ? readFile(target.files[0]) : 1}/>
            </div>
        </div>
        </div>
        <div className="body">
            <div className="left"></div>
            <div className="mid" ref={refTextContent}></div>
            <div className="right">
                <div className="bar">&nbsp;</div>
                <input type="text"/>
            </div>
        </div>
    </div>
};

export default  Home;