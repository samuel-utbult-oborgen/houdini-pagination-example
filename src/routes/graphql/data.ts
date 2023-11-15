type Country = {
    id: number;
    name: string;
};

type Currency = {
    id: number;
    name: string;
};

type Customer = {
    id: number;
    name: string;
    countryID: number;
    currencyID: number;
};

export default {
    countries: (() => {
        const countries: Country[] = [];
        for (let id = 1; id <= 100; id++) {
            countries.push({
                id: id,
                name: `Country ${id}`,
            });
        }
        return countries;
    })(),
    currencies: (() => {
        const currencies: Currency[] = [];
        for (let id = 1; id <= 100; id++) {
            currencies.push({
                id: id,
                name: `Currency ${id}`,
            });
        }
        return currencies;
    })(),
    customers: (() => {
        const customers: Customer[] = [];
        for (let id = 1; id <= 100; id++) {
            customers.push({
                id: id,
                name: `Customer ${id}`,
                countryID: id,
                currencyID: 101 - id,
            });
        }
        return customers;
    })(),
};
