export const getTokensForAccount = (account: string) => {
    const accountStorage = 'account-' + account;
    const retrievedData = localStorage.getItem(accountStorage);
    return retrievedData;
};
