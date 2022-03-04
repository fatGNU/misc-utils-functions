import React from "react";
import {render} from 'react-dom';
import CloseControl from "./components/general-components/controls/svg-controls/CloseControl";
// import {createBrowserHistory} from 'history';
import './components/general-components/messenger/messenger.css';
import {useNavigate, useParams} from "react-router-dom";
import {BCLB} from "./components/general-components/redux/allowed-actions";
// messaging behaviour globally so long as it's imported
/*********************************************************/
const listOfPriorityColours = {
    1: "#1259e6",//blue for information
    2: "#cc0000", //red for error
    3: "#fca708", //warning
    4: "#188e09", //success
    5: "#e9e8ed", //general-components_to_delete info
};
/*********************************************************/
export const col1 = "lg-1 xs-1 sm-1 col-md-1",
    col2 = "lg-2 sm-2 xs-2 col-md-2",
    col3 = "lg-3 xs-3 sm-3 col-md-3",
    col4 = "lg-4 xs-4 sm-4 col-md-4",
    col5 = "lg-5 xs-5 sm-5 col-md-5",
    col6 = "lg-6 xs-6 sm-6 col-md-6",
    col7 = "lg-7 xs-7 sm-7 col-md-7",
    col8 = "col-md-8 lg-9 xs-8 sm-8",
    col9 = "col-md-9 lg-9 xs-9 sm-9",
    col10 = "lg-10 xs-10 sm-10 col-md-10",
    col11 = "lg-11 xs-11 sm-11 col-md-11",
    col12 = "lg-12 xs-12 sm-12 col-md-12",
    row = "row",
    container = "container",
    containerFluid = "container-fluid";

// /**
//  *
//  * Create browser history object to access.
//  * @type {BrowserHistory} the browser history object
//  *
//  */
// export const browserHistory = createBrowserHistory();
/**
 *
 * A wrapper for supporting class-based components_to_delete to enable navigation by using react hook's useNavigate
 * object
 * @returns {function(*)} wrapper of the suggested component to get wrapped with the appropriate props
 *
 * @param WrappedNavigableComponent the wrapped component containing references to function hooks
 *
 */
export const withClassComponentNavigationSupport = (WrappedNavigableComponent) => {
    return existingProps =>
        <WrappedNavigableComponent {...existingProps} params={useParams()} navigate={useNavigate()}/>;
}
/**
 *
 * Convert array of jsons into a json object
 * @param arrayOfJSONS array of jsons in question [{},{},...]
 * @returns {{}} json with consolidated json data in one object
 */
export const arrayOfJSONsToJSON = (arrayOfJSONS) => {
    let json = {};
    let k = 0;
    do {
        const currentJsonKey = Object.getOwnPropertyNames(arrayOfJSONS[k])[0];
        json[currentJsonKey] = arrayOfJSONS[k][currentJsonKey];
        k += 1;
    } while (k < arrayOfJSONS.length)
    return json;
}
/**
 *
 * Convert array of jsons into a array object containing all values of the object in question
 * @param arrayOfJSONs array of jsons in question [{},{},...]
 * @returns {{}} json with consolidated json data in one object
 */
export const arrayOfJSONsToValuesARRAY = arrayOfJSONs => {
    return Object.values(arrayOfJSONsToJSON(arrayOfJSONs));
}
/**
 *
 * gets a sentence out of symbols and a json object containing the keys of these symbols and respective valyes.
 * @returns {string}
 *
 */
export const getStringifiedDataAsSentence = (arrayData, source) => {
    let dataSentence = '';
    let x = 0;
    do {
        if (x === arrayData.length - 1)
            dataSentence += ' and ';
        if (x > 0 && x < arrayData.length - 1)
            dataSentence += ', ';
        dataSentence += `${extractValueFromJSON(arrayData[x], arrayOfJSONsToJSON(source))}`;
        x += 1;
    } while (x < arrayData.length)
    return dataSentence;
}

/**
 *
 * Shows a message bubble with a message. Its not meant to distract the user, rather acts like a notification.
 * @param message the message text to show
 * @param priority An integer (1 - 5) representing some pre-defined
 *                  colour-coding of the message (think of it like a theme
 *
 * Take note of the setState callback method there
 * @param bubble
 *
 * @param title title of the messenger whtn the bubble is false
 *
 */
export const notify = (message, priority = 5, bubble = false, title = null) => {
    // document body appendChild: message then fade it out slowly fo 8 seconds. remove it after 10 seconds
    let target = null;
    const overlay = document.querySelector("#overlay");
    const removeMessage = () => {
        render(null, overlay);
    };
    // change the styling for message priority 5
    const priority5Style = priority === 5 ? {color: '#1313E1FF'} : null;
    // check whether it's a message bubble or a entire window
    //
    const messageWithCurtain =
        <div className={'message-curtain'}>
            <div className={'message-window'}>
                {/*// side bar*/}
                <div className={'indicator-bar'} style={{background: listOfPriorityColours[priority]}}/>
                {/*// title*/}
                <div className={'message-space'}>
                    <div className={'title-bar'}>
                        <div className={'message-title'}>
                            {title}
                        </div>
                        <div>
                            <CloseControl callback={removeMessage}/>
                        </div>
                    </div>
                    <div className={'message'}>
                        {message}
                    </div>
                </div>
            </div>
        </div>;
    // declare a messageWindow
    const mWindow = <div className={'bubble-message-window'}>
        <div className={row} style={{height: '100%'}}>
            <div className={col2} style={{height: '100%', background: listOfPriorityColours[priority]}}/>
            <div
                className={col10}
                style={{height: '100%'}}
            >
                <div className={row}>
                    <div className={'message-bubble'} style={priority5Style}>
                        {message}
                    </div>
                </div>
            </div>
        </div>
    </div>
    //
    //
    //
    if (bubble) {
        render(mWindow, overlay);
        window.setTimeout(removeMessage, 10000)
    } else
        render(messageWithCurtain, overlay)
}
/**
 *
 * Get the value out of some json data by specifying the key
 * @param e the key to use in getting that data
 * @param sourceData the array of json arrays which contains the source of this data
 * @returns {null|*} the <string> value of this item
 *
 */
export const extractValueFromJSON = (e, sourceData) => {
    //e is list of games
    const keys = Object.getOwnPropertyNames(sourceData);
    for (const t of keys) {
        if (keys.includes(String(e))) {
            return sourceData[e];
        }
    }
    // do not return a game
    return null; //return <span style={{fontSize: '0.4em'}}><i>to be selected</i></span>;
}
/**
 *
 * Creates a JSONified stirng but without escape symbols >> \" for all items
 *
 * @param miscData the json to reformat
 * @returns {string} the stringLikeJSON string object
 */
export const getStringLikeJSON = miscData => {
    let x = 0;
    const propNames = Object.getOwnPropertyNames(miscData);
    let stringLikeJSON = '{'
    do {
        stringLikeJSON += `"${propNames[x]}":"${miscData[propNames[x]]}"`
        if (x < propNames.length - 1)
            stringLikeJSON += ','
        x += 1;
    } while (x < propNames.length)
    stringLikeJSON += '}';
    return stringLikeJSON;
}
/**
 *
 * Get current date of the day, based off of the time on the local machine.
 * NOTE: Use with extra care because this number is dependent on the user's
 * machine's time.
 * @param likeConversation a boolean value setting the format of the date to
 *                      a conversation-driven format.
 * @returns {`${number}/${number}/${number}`} the date in question
 *
 *
 */
export const getDate = (likeConversation = false) => {
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dateFormat = '';
    let dateObj = new Date();
    //NOTE: getDay means something but not the actual date number!
    if (likeConversation)
        dateFormat = `${dateObj.getDate()} of ${monthList[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;
    else
        dateFormat = `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`;
    return dateFormat;
}
/**
 *
 * Read from local storage and fetch data or return entire storage if no specific item is required
 *
 * @param itemToFetch specific item to read
 * @param fromStorageName the name of the local storage object
 * @returns {null} the entire storage or the specified item else null (if the specified storage name is absent.
 *
 *
 */
export const readFromLocalStorage = (itemToFetch = null, fromStorageName) => {
    let storageData = null;
    if (fromStorageName) {
        storageData = localStorage.getItem(fromStorageName);
        if (storageData)
            storageData = JSON.parse(storageData);
        if (itemToFetch)
            storageData = storageData[itemToFetch];
    }
    return storageData;
}
/**
 *
 * gets the storage data
 * @param fromName
 *
 */
export const getStorageObject = fromName => {
    const storage = JSON.parse(localStorage.getItem(fromName));
    return storage
}
/**
 *
 * Function converts base64 strings to file objects
 * @param base64 the base64 string to convert
 * @param filename the file name to append to the file
 * @returns {File} the file object
 */
export const base64ToFileObject = (base64, filename) => {

    let arr = base64.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
}
/**
 *
 * Formats date based on the desired format. Defaults to dmy (day month year)
 * @param date the date to reformat
 * @param currentFormat the current format of this date
 * @param desiredFormat the desired format
 * @param desiredSeparator the desired separator to put between the dates
 * @returns {string} reformatted date.
 *
 */
export const formatDate = (date = String(), currentFormat = 'dmy', desiredFormat = 'dmy', desiredSeparator = '/') => {
    const separators = ['/', '.', '-', ' ', '\w'];
    let formattedDate = String();
    let splitDate = [];
    let k = 0;
    do {
        if (date.includes(separators[k])) {
            splitDate = date.split(separators[k]);
            break;
        }
        k += 1;
    } while (k < separators.length);
    // one, two, three represent the current format that's known.
    if (desiredFormat === currentFormat)
        formattedDate = date;
    else if (currentFormat === 'dmy' && desiredFormat === 'dmy')
        formattedDate = `${splitDate[0]}${desiredSeparator}${splitDate[1]}${desiredSeparator}${splitDate[2]}`;
    else if (currentFormat === 'dmy' && desiredFormat === 'ymd')
        formattedDate = `${splitDate[2]}${desiredSeparator}${splitDate[1]}${desiredSeparator}${splitDate[0]}`;
    else if (currentFormat === 'dmy' && desiredFormat === 'ydm')
        formattedDate = `${splitDate[2]}${desiredSeparator}${splitDate[0]}${desiredSeparator}${splitDate[1]}`;
    //////////////////////////////////////////
    else if (currentFormat === 'ymd' && desiredFormat === 'ydm')
        formattedDate = `${splitDate[0]}${desiredSeparator}${splitDate[2]}${desiredSeparator}${splitDate[1]}`;
    else if (currentFormat === 'ymd' && desiredFormat === 'dmy')
        formattedDate = `${splitDate[2]}${desiredSeparator}${splitDate[1]}${desiredSeparator}${splitDate[0]}`;
    else if (currentFormat === 'ymd' && desiredFormat === 'mdy')
        formattedDate = `${splitDate[1]}${desiredSeparator}${splitDate[0]}${desiredSeparator}${splitDate[2]}`;
    //////////////////////////////////////////
    else if (currentFormat === 'mdy' && desiredFormat === 'ydm')
        formattedDate = `${splitDate[2]}${desiredSeparator}${splitDate[1]}${desiredSeparator}${splitDate[0]}`;
    else if (currentFormat === 'mdy' && desiredFormat === 'ymd')
        formattedDate = `${splitDate[2]}${desiredSeparator}${splitDate[0]}${desiredSeparator}${splitDate[1]}`;
    else if (currentFormat === 'mdy' && desiredFormat === 'dmy')
        formattedDate = `${splitDate[1]}${desiredSeparator}${splitDate[0]}${desiredSeparator}${splitDate[2]}`;
    //
    //
    return formattedDate;
}
/**
 *
 * Deconstructs a name from its constituent symbols. By default, it'll deconstruct along a '_' symbol.
 * Alternatively, it'll do so along the capital letters in a given snake-cased word.
 *
 * @param variableName the variable name to deconstruct
 * @param separator the symbol to deconstruct along...
 * @returns {*[]} the deconstructed name.
 *
 */
export const nameFromVariableName = (variableName, separator = '_') => {
    let deconstructedName = variableName;//default return item
    const k = variableName.split(separator);
    if (k.length === 0) {
        //attempt at splitting along the camel case
        let words = [];
        let currentIndex = 0;
        const uppercaseRegExp = new RegExp(/^[A-Z]*$/);
        for (const k of variableName) {
            if (uppercaseRegExp.test(k)) {
                currentIndex += 1
            }
            //by default, add it to current
            words[currentIndex] += k;
        }
        deconstructedName = words;
    }
    //if k is greater than zero
    else {
        // this is an array
        // loop through and add a space in between where the symbol is
        deconstructedName = variableName.replaceAll(separator, ' ');
        // deconstructedName = k;
    }
    return deconstructedName;
}

//
//
/**
 *
 * Paraphrases a given string by returning a string with '...' (alama za dukuduku)
 * @param item the string to paraphrase
 * @param length the desired length defaults to 5 characters in the string
 * @returns {string|string} a paraphrased string, or the original string
 *
 */
export const paraphrase = (item, length = 5) => {
    let _item_ = '';
    let k = 0;
    let isParaphrased = false;
    if (item.length >= length) {
        while (k <= length) {
            _item_ += item[k];
            k += 1;
            isParaphrased = true;
        }
    }
    return isParaphrased ? `${_item_}...` : item;
}
/**
 *
 * function to test equality of objects without using references, but instead
 * comparing the contents of these objects using their keys or attribute properties
 *
 * @param a object 1
 * @param b object 2
 * @returns {boolean} true for similarity else false
 *
 */
export const equalObjects = (a, b) => {
    const entries_a = Object.getOwnPropertyNames(a);
    const entries_b = Object.getOwnPropertyNames(b);
    if (entries_a.length !== entries_b.length) {
        return false;
    }
    for (let i in entries_a.length) {
        // Keys
        if (entries_a[i][0] !== entries_b[i][0]) {
            return false;
        }
        // Values
        if (entries_a[i][1] !== entries_b[i][1]) {
            return false;
        }
    }

    return true;
}
/**
 *
 * read file contents into a base64 string
 * @param _file the file object to read as base64
 * @param callback a callback method to execute when read is complete
 * @returns {string} the file in form of a base64 string
 *  that the file contents are translated to.

 */
export const convertToBase64 = (_file = File | Blob, callback = undefined) => {
    // Declare a conversion error message
    const conversionErrorMessage = `Argument 1 (_file) of Method 
        'convertToBase64' expected a file object or a base64 string (if already converted).
         Found "${_file.constructor.name}" instead!`
    // declare a ReferenceError message
    const callbackReferenceErrorMessage = `convertToBase64 requires a callback as a second argument.
        This is because this method's file-read activity is asynchronous and does not do well with returning
        its output. Pass a method reference(--without-arguments--) which will execute when
        the internal file-read-operation is complete.`;
    if (callback === undefined) {
        console.warn(callbackReferenceErrorMessage)
        notify(callbackReferenceErrorMessage, 3, false, 'file read callback recommended!');
        // throw new ReferenceError();
    }
    let fR = new FileReader();
    if (_file instanceof File || _file instanceof Blob) {
        let fileString;
        fR.readAsDataURL(_file);
        fR.onload = (e) => {
            fileString = e.target.result;
            if (callback !== undefined) {
                callback(fileString);
            }
            // return fileString;
        };
    } else if (_file instanceof String) {
        // find out if it's a base64 object
        let base64String = _file.split(',')[0].split(';')[0]
        if (base64String === 'base64')
            callback(_file)// this is a base64 object
    }
    /*This is an array of objects of the format: {category: <some-number>, content: <File-or-Blob-object>}*/
    else if (_file.constructor.name === [].constructor.name) {
        let files = [];
        let fileString;
        // loop through the arrays, crate base64 objects then call the callback
        for (const f of _file) {
            console.log('f is ', f)
            fR.readAsDataURL(f.content);
            fR.onload = e => {
                fileString = e.target.result;
                files.push(fileString);
            }
        }
        // call the callback on the data in question
        if (callback)
            callback(files);
    } else {
        console.error(conversionErrorMessage);
        notify(conversionErrorMessage,
            2, false, 'Base64 conversion error');
    }

    // throw new TypeError(`Argument 1 (_file) of Method 'convertToBase64' expected a file object or a base64 string (if already converted). Found ${typeof _file}`);
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    container,
    containerFluid,
    col1,
    col2,
    col3,
    col4,
    col5,
    col6,
    col7,
    col8,
    col9,
    col10,
    col11,
    col12,
    // browserHistory,
    withClassComponentNavigationSupport,
    notify,
    getDate,
    paraphrase,
    nameFromVariableName,
    equalObjects,
    convertToBase64,
    base64ToFileObject,
    extractValueFromJSON,
    getStringLikeJSON,
    getStorageObject,
    readFromLocalStorage,
    arrayOfJSONsToValuesARRAY,
    getStringifiedDataAsSentence
};
