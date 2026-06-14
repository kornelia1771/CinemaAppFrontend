export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const nameRegex = /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s-]+$/u;
export const surnameRegex = nameRegex;
export const passwordRegex = /^(?=.*[A-ZĄĆĘŁŃÓŚŹŻ])(?=.*[a-ząćęłńóśźż])(?=.*\d)(?=.*[^A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]).{8,}$/u;

export const uppercaseRegex = /[A-ZĄĆĘŁŃÓŚŹŻ]/;
export const lowercaseRegex = /[a-ząćęłńóśźż]/;
export const numberRegex = /\d/;
export const specialCharRegex = /[^A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]/;

export const nameOnlyRegex = /[^A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s-]/gu;