export const isValidPhoneNumber = (phoneNumber) => {
    const regex = /^(?:\+57|57)?[1-9][0-9]{9}$/;
    return regex.test(phoneNumber); 
}