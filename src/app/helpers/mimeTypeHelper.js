import mimeTypes from '../../config/mimeTypes';
import stringHelper from './stringHelper';
import path from 'path';

let cache = {};

let getType = filePath => {
    if (filePath && filePath.length > 0) {
        let parts = stringHelper.split(filePath, '?', true);
        let ext = path.extname(parts[0]);

        let type = cache[ext];

        if (type === undefined) {
            type = '';

            for (let i = 0; i < mimeTypes.length; i++) {
                let item = mimeTypes[i];
                if (item.suffix === ext) {
                    type = item.type;
                    break;
                }
            }
            cache[ext] = type;
        }
        return type;
    }
    return '';
};

export default {
    getType
};
