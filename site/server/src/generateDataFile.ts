import {createConnection} from 'typeorm';
import {Gallery} from './entity/Gallery';
import {Tag} from './entity/Tag';

import fs from 'fs';
import {join} from 'path';
import pLimit from 'p-limit';


const limit = pLimit(10000);

createConnection().then(async connection => {
    console.log('reading...');
    const file = await fs.promises.readFile(join(__dirname, '../../../gdata.json'), 'utf8');
    const data = JSON.parse(file);
    const tags: Tag[] = [];
    console.log('starting...');
    setInterval(() => {
        console.log(`${limit.pendingCount} remaining...`);
    }, 3000);
    const tasks = Object.values(data).map((it: any) => {
        return limit(async () => {
            const gallery = new Gallery();
            gallery.archiver_key = it.archiver_key;
            gallery.category = it.category;
            gallery.expunged = it.expunged;
            gallery.filecount = it.filecount;
            gallery.filesize = it.filesize;
            gallery.gid = it.gid;
            gallery.posted = it.posted;
            gallery.rating = it.rating;
            gallery.thumb = it.thumb;
            gallery.title = it.title;
            gallery.title_jpn = it.title_jpn;
            gallery.token = it.token;
            gallery.torrentcount = it.torrentcount;
            if (it.uploader != null) {
                gallery.uploader = it.uploader;
            } else {
                gallery.uploader = '';
            }
            const gtags = [];
            for await (const tagName of it.tags) {
                // tslint:disable-next-line:no-shadowed-variable
                if (!tags.some(it => it.name === tagName)) {
                    const tag = new Tag();
                    tag.name = tagName;
                    tags.push(tag);
                    await connection.manager.save(tag);
                }
                // tslint:disable-next-line:no-shadowed-variable
                gtags.push(tags.filter(it => it.name === tagName)[0]);
            }
            gallery.tags = gtags;
            await connection.manager.save(gallery);
        });
    });
    await Promise.all(tasks);
    console.log('done');
}).catch(error => console.log(error));
