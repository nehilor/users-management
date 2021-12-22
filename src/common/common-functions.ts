import * as fs from 'fs';
import * as Moment from 'moment';
import { PrintColorType } from '../enums/print-color-type.enum';
import mongodb = require('mongodb');

const ObjectID = mongodb.ObjectID;

import * as Chalk from 'chalk';
import { ServiceResultInterface } from '../interfaces/service-result.interface';

const carpathia: any = require('carpathia');

export class CommonFunctions {

  public constructor() { }

  // create the params list to make a search by proximity
  // params:
  //  - params: array of paramaters to use
  // returns:
  // - json params list
  public static buildQueryParams(params: any): {} {
    try {
      let paramObject: {} = new Object();
      if (params) {
        let keys = Object.keys(params);
        for (let i in keys) {
          if (ObjectID.isValid(params[keys[i]])) {
            paramObject[keys[i]] = params[keys[i]];
          } else {
            switch (typeof params[keys[i]]) {
              case 'boolean':
                paramObject[keys[i]] = Boolean(params[keys[i]]);
                break;
              case 'number': {
                paramObject[keys[i]] = Number(new RegExp(params[keys[i]]));
                break;
              }
              case 'string': {
                paramObject[keys[i]] = { $regex: params[keys[i]], $options: 'i' };
                break;
              }
              case 'object': {
                let filters: Array<any> = [];
                for (
                  let index: number = 0;
                  index < params[keys[i]].length;
                  index++
                ) {
                  filters.push(params[keys[i]][index]);
                }
                paramObject[keys[i]] = { $in: filters };
                break;
              }
              default: {
                if (params[keys[i]] instanceof Date) {
                  paramObject[keys[i]] = new Date(
                    new RegExp(params[keys[i]]).toString()
                  );
                  break;
                }
                paramObject[keys[i]] = new RegExp(params[keys[i]]);
                break;
              }
            }
          }
        }
      }
      return paramObject;
    } catch (ex) {
      throw Error(ex.message);
    }
  }

  // generate a UUID (universally unique identifier)
  // params:
  //  - useDash: boolean value to indicate if must use a dash ("-") inside the UUID
  // returns:
  // - UUID string
  public static generateUUID(useDash: boolean): string {
    var date = new Date().getTime();
    var uuid = useDash
      ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
        var r = (date + Math.random() * 16) % 16 | 0;
        date = Math.floor(date / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
    return uuid;
  }

  // transforms a word"s first letter into a uppercase letter
  // params:
  //  - word: string to transform
  // returns:
  // - string
  public static setCapitalLetter(word: string): string {
    return word[0].toUpperCase() + word.substring(1, word.length);
  }

  // converts a date/time string into milisecods using moment js
  // params:
  //  - dateTimeString: date/time string
  //	-	dateTimeType: type of data string
  //		*	date
  //		* time
  //		*	dateTime
  // returns:
  // - number
  public static convertTimeToMilliseconds(
    dateTimeString: string,
    dateTimeType: string
  ): number {
    let momentObj: any;
    switch (dateTimeType) {
      case 'date':
        momentObj = Moment(dateTimeString, 'YYYY-MM-DD');
        break;
      case 'time':
        if (dateTimeString.length === 5) {
          dateTimeString += ':00';
        }
        momentObj = Moment(dateTimeString, 'HH:mm:ss');
        break;
      case 'dateTime':
        momentObj = Moment(dateTimeString, 'YYYY-MM-DD HH-mm Z');
        break;
    }
    return Number(momentObj.format('x'));
  }

  // converts a millisecods into date/time object using moment js
  // params:
  //  - mls: milliseconds number
  //	-	dateFormat: type of data string
  // returns:
  // - string
  public static convertMillisecondsToTime(mls: number, dateFormat: string) {
    return Moment(mls).format(dateFormat);
  }
}
