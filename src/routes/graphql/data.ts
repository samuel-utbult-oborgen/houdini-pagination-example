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
    country: Country;
    currencyID: number;
    currency: Currency;
};

const countries = (() => {
    const countries: Country[] = [];
    for (let id = 1; id <= 100; id++) {
        countries.push({
            id: id,
            name: `Country ${id}`,
        });
    }
    return countries;
})();

const currencies = (() => {
    const currencies: Currency[] = [];
    for (let id = 1; id <= 100; id++) {
        currencies.push({
            id: id,
            name: `Currency ${id}`,
        });
    }
    return currencies;
})();

const customers = (() => {
    const customers: Customer[] = [];
    for (let id = 1; id <= 100; id++) {
        const countryID = id;
        const currencyID = 101 - id;

        customers.push({
            id: id,
            name: `Customer ${id}`,
            countryID,
            country: countries[countryID - 1],
            currencyID,
            currency: currencies[currencyID - 1],
        });
    }
    return customers;
})();

export default {
    countries,
    currencies,
    customers,
};
