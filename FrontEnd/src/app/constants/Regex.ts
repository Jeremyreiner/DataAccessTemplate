export class Regex {

  static isValidEmail(email: string): boolean {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  }

  static isValidPassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }

  /**
   * Returns a number representing the strength of the password with 3 being the strongest and 1 being the weakest
   * @param password
   */
  static getPasswordStrength(password: string): number {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (password.length < 8) {
      return 1;
    } else if (!regex.test(password)) {
      return 2;
    } else {
      return 3;
    }
  }

}
