import { ConcreteSubscription } from "./Subscription";

export class LrSettings{
    length: number = 10;
    pageI:number = 0;
    separator:string = "";
    totalLength: number = 0;
    fontSize: number = 14;
    textSelected = "";

    content = {
        localStorageKey : ""
    }

    layout = {
        left: {width:100},
        top: {height:100},
    }
    navigation = {
        length:  10,
        pageI: 0,
        separator:  "",
    }
    pages :{ [key:number]: PageSettings}= {}
    commandList: CommandSettings[] = [ { code: "keywords", layout: "right"}]
   
}

export class CommandSettings{
    layout = ""
    code = ""
}

export class PageSettings{
    keyWordList :KeywordSettings[] = []
}

export class KeywordSettings{
    text =""
    color = ""
    isGlobal = false
}