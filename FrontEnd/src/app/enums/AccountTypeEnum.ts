export enum AccountTypeEnum {
  teacher,
  student,
  course,
  book
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AccountTypeEnum {
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  export function toString(input: AccountTypeEnum, capitalize = false): string {
    if (capitalize) {
      const word = AccountTypeEnum[input];
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return AccountTypeEnum[input];
  }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  export function toEnum(input: string): AccountTypeEnum {
    return AccountTypeEnum[input];
  }
}
