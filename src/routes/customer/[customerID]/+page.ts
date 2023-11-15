import type { GetCustomerVariables } from "./$houdini";

export const _GetCustomerVariables: GetCustomerVariables = (event) => {
    return {
        id: parseInt(event.params.customerID),
    };
};
