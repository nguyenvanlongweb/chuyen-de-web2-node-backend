import Country from '~/app/models/country';

type DataResponse = {
  data: Array<Object>;
  totalPage: number;
  currentPage: number;
};

class countryRepository {
  constructor() {}

  async addCountries(data: Array<any>, force?: boolean) {
    // console.log(data);

    await Country.sync({
      // force: true,
    });

    if (data.length > 0) {
      data.map(async (e) => {
        await Country.create({
          name: e.name,
          image: e.image ? e.image : '',
          slug: e.slug,
        });
      });
    }
  }
  async getCountries(page: number) {
    console.log((page - 1) * 20);

    const data = await Country.findAndCountAll({
      offset: (page - 1) * 20,
      limit: 20,
    });

    const resp: DataResponse = {
      totalPage: Math.ceil(data.count / 20),
      currentPage: page,
      data: data.rows,
    };

    return resp;
  }

  async getAllCountries() {
    const data = await Country.findAndCountAll();
    return data;
  }
}

export default new countryRepository();
