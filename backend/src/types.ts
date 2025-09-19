import z from "zod";

const parseObject = z.object({
    username:z.string().min(3).max(10),
    password:z.string()
              .min(8, "Password must be atleast 8 characters")
              .max(20, "Password must be atmost 20 characters")
              .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
              .regex(/[a-z]/, "Password must contain at least one lowercase letter")
              .regex(/[0-9]/, "Password must contain at least one digit")
              .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
})

export default parseObject;