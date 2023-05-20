export class ProfileAttribute {
  id: number;
  label: string;
  content: string[] = [];
  constructor(id: number, label: string, content: string[]) {
    this.id = id;
    this.label = label;
    this.content = content;
  }
}
