import express from 'express';
import {createConnection, Repository} from 'typeorm';
import {Gallery} from '../entity/Gallery';
import catConfig from '../config/cat.json';

const ApiRouter = express.Router();
let galleryRepo: Repository<Gallery>;
createConnection().then(connection => {
    galleryRepo = connection.getRepository(Gallery);
});
const catKeys = Object.keys(catConfig);
ApiRouter.get('/', async (req, res, next) => {
    const {page, search, cat} = req.query;
    const query = galleryRepo
        .createQueryBuilder('g')
        .leftJoinAndSelect('g.tags', 't');
    if (search !== undefined && search != null && search !== '') {
        query.where('(g.title like :name OR g.title_jpn like :name OR t.name like :name)', {name: `%${search}%`});
    }
    if (cat !== undefined && cat != null) {
        const actualCats = [].concat(cat).filter(it => catKeys.includes(it));
        if (actualCats.length > 0) {
            query.andWhere('g.category in (:...cats)', {
                cats: [].concat(cat).filter(it => catKeys.includes(it)).map((it: string) => (catConfig as any)[it])
            });
        }
    }
    const items = await query
        .orderBy('g.gid', 'DESC')
        .skip((page || 0) * 20)
        .take(20)
        .getMany();
    items.forEach(it => (it.tags as any) = it.tags.map(tag => tag.name));
    res.send({
        // totalPage: Math.ceil(total / 20),
        // totalCount: total,
        currentPage: page || 0,
        items,
    });
});

export default ApiRouter;
