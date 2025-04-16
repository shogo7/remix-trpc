import type { Request } from 'express';

const test = (req: Request) => {
  req.user // ← ここで補完が出れば成功！
};
