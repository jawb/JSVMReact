/* @flow */

import Promise from 'bluebird'


export default function readFile(file: any) : Promise {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = event => {
            const text = event.target.result
            resolve(text)
        }
        reader.onabort = reject
        reader.onerror = reject

        reader.readAsText(file)
    })
}
