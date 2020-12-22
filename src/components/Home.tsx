import { createRef, useEffect, useState } from "react"
import "./Home.scss";
import Encoding from "encoding-japanese";

const Home = function(){
    
    const [settings,setSettings] = useState({ 
        caractersLen: 100, 
        pageI: 0,
        caractersTotal: 0,
        separator: "",
    }); 
    const [fontSize,setFontSize] = useState(14);
    const refTextContent  =createRef<HTMLDivElement>();


    const FONT_SIZE_KEY = "fontSize";
    const TEXT_CONTENT_KEY = "textContentKey";

    const getDefaultBodyFontSize = function(){
        return  parseInt(window.localStorage.getItem(FONT_SIZE_KEY) || "14");
    }


    const changeBodyFontSizeTo = function(val : number){
        setFontSize(val);
        document.body.style.fontSize = val + "px";
        window.localStorage.setItem(FONT_SIZE_KEY,val.toString());
    }

   useEffect( ()=>{
    changeBodyFontSizeTo(getDefaultBodyFontSize())
   },[]);

   useEffect(()=>{
    const textContent = window.localStorage.getItem(TEXT_CONTENT_KEY) || "";
    render(textContent,getTextContentPosI(settings.pageI, settings.caractersLen),settings.caractersLen);
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

                const pos = getTextContentPosI(settings.pageI, settings.caractersLen);

                render(textContent,pos,settings.caractersLen);
                window.localStorage.setItem(TEXT_CONTENT_KEY,textContent);
        }
        reader.readAsArrayBuffer(file);
    }

    const getTextContentPosI = (i:number,len:number) => i * len;

    return <div className="home">
        <div className="head">
            <div className="item">
                <button type="button" onClick={()=> setSettings({...settings,pageI: settings.pageI - 1}) }>&lt;</button>
                <input className="counter" type="text" value={settings.pageI + 1}/>
                <input onChange={({target}) => setSettings({...settings,caractersLen: parseInt(target.value)})} type="text" value={settings.caractersLen}/>
                <input onChange={({target}) => setSettings({...settings,separator: target.value.trim()})}  type="text" className="counter" value={settings.separator}/>
                <button type="button"onClick={()=> setSettings({...settings,pageI: settings.pageI + 1}) }>&gt;</button>
            </div>
            <div className="item">
            <button type="button" onClick={ ()=> changeBodyFontSizeTo(fontSize - 1)}>-</button>
            <input type="text" onChange={ ({target})=> changeBodyFontSizeTo(parseInt(target.value) || 0)}  value={fontSize} style={{ width: "25px"}}/>
            <button type="button" onClick={ ()=> changeBodyFontSizeTo(fontSize + 1)}>+</button>
            </div>

            <label className="item">
                <input onChange= { ({target}) => refTextContent.current?.setAttribute("contentEditable",target.checked.toString())  } type="checkbox"/>
                Edit text.
            </label>
            <div className="item">
                <input type="file" onChange={({target}) => target.files?.length ? readFile(target.files[0]) : 1}/>
            </div>
        </div>
        <div className="body">
            <div className="left"></div>
            <div className="mid" ref={refTextContent}></div>
            <div className="right"></div>
        </div>
    </div>
};

export default  Home;