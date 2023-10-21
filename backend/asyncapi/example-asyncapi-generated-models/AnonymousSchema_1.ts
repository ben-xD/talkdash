
class AnonymousSchema_1 {
  private _id?: number;
  private _lumens?: number;
  private _sentAt?: string;
  private _additionalProperties?: Map<string, any>;

  constructor(input: {
    id?: number,
    lumens?: number,
    sentAt?: string,
    additionalProperties?: Map<string, any>,
  }) {
    this._id = input.id;
    this._lumens = input.lumens;
    this._sentAt = input.sentAt;
    this._additionalProperties = input.additionalProperties;
  }

  get id(): number | undefined { return this._id; }
  set id(id: number | undefined) { this._id = id; }

  get lumens(): number | undefined { return this._lumens; }
  set lumens(lumens: number | undefined) { this._lumens = lumens; }

  get sentAt(): string | undefined { return this._sentAt; }
  set sentAt(sentAt: string | undefined) { this._sentAt = sentAt; }

  get additionalProperties(): Map<string, any> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<string, any> | undefined) { this._additionalProperties = additionalProperties; }
}
export default AnonymousSchema_1;
