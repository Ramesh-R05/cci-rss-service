import striptags from 'striptags';
import unmarked from 'remove-markdown';

let isEmpty = str => {
    return (typeof str === 'undefined' || str === '' || str === null);
};

let stripHtml = (str, allowedTags) => {
    return striptags(str, allowedTags);
};

let stripMarkdown = str => {
    return unmarked(str);
};

let split = (str, sourceSeparator, sourceRemoveEmpty) => {
    let separator = sourceSeparator;
    let removeEmpty = sourceRemoveEmpty;
    separator = !isEmpty(separator) ? separator : ',';
    removeEmpty = !isEmpty(removeEmpty) ? removeEmpty : false;

    let items = str.split(separator);

    if (removeEmpty) {
        let clean = [];
        items.forEach(item => {
            if (!isEmpty(item)) {
                clean.push(item);
            }
        });
        items = clean;
    }

    return items;
};

export default {
    split,
    isEmpty,
    stripHtml,
    stripMarkdown
};
