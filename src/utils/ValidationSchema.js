import * as yup from "yup";

export const registrationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  name: yup.string().required("Name is required"),
  password: yup
    .string()
    .min(5, "Password must contain at least 5 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});
export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(5, "Password contains more than 5 characters")
    .required("password is required"),
});
export const createCompanySchema = yup.object({
  name: yup
    .string()
    .min(3, "min. 3 characters required")
    .required("Company name is required"),
});
export const editCompanySchema = yup.object({
  name: yup
    .string()
    .min(3, "min. 3 characters required")
    .required("Company name is required"),
});
export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const createUserSchema = yup.object({
  name: yup
    .string()
    .min(3, "min. 3 characters required")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "The password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
    ),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  is_active: yup.string().required("Status is required"),
  roles: yup
    .array()
    .min(1, "At least one role must be selected")
    .required("At least one role must be selected"),
});
export const editUserSchema = yup.object({
  name: yup
    .string()
    .min(3, "min. 3 characters required")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  is_active: yup.string().required("Status is required"),
  roles: yup
    .array()
    .min(1, "At least one role must be selected")
    .required("At least one role must be selected"),
});

export const createRoleSchema = yup.object({
  name: yup
    .string()
    .min(3, "min. 3 characters required")
    .required("Role name is required"),
});
export const createCategorySchema = yup.object({
  name: yup
    .string()
    .min(3, "min. 3 characters required")
    .required("Category name is required"),
});
export const assignPrivilegeSchema = yup.object({
  privilege_ids: yup
    .array()
    .min(1, "At least one role must be selected")
    .required("At least one role must be selected"),
});
export const createVendorSchema = yup.object({
  name: yup
    .string()
    .min(3, "min. 3 characters required")
    .required("Vendor name is required"),
});
export const createRawMaterialSchema = yup.object({
  name: yup
    .string()
    .required("Raw Material Name is required"),
  sku: yup
    .string()
    .required("Raw Material SKU is required"),
  unit_name: yup.string().required("Raw Material Unit is required"),
});
export const createBillSchema = yup.object({
  vendor_name: yup.string().required("Vendor Name is required"),
  memo: yup.string().notRequired(),
  bill_date: yup.string().required("Date is required"),
  po_number: yup.string().required("PO Number is required"),
  bill_number: yup.string().required("Bill Number is required"),
  bill_raw_materials: yup
    .array()
    .of(
      yup.object().shape({
        sku: yup.string().required("SKU is required"),
        name: yup.string().required("Product Name is required"),
        description: yup.string().notRequired(),
        unit: yup.string().required("Unit is required"),
        category: yup.string().required("Category is required"),
        unit_price: yup
          .number()
          .required("Rate is required")
          .positive("Quantity must be a positive number"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .positive("Quantity must be a positive number"),
        additional_cost: yup.number().notRequired(),
        total_price: yup
          .number()
          .required("Item total is required")
          .min(1, "Item total is required")
      })
    )
    .required("At least one item must be added"),
});
export const createFinishGoodSchema = yup.object({
  name: yup
    .string()
    .min(3, "min. 3 characters required")
    .required("Finished Good Name is required"),
  sku: yup
    .string()
    .min(3, "min. 3 characters required")
    .required("Finished Good SKU is required"),
  unit: yup.string().required("Finished Good Unit is required"),
});

export const createBomSchema = yup.object({
  bom_name: yup.string().required(" BOM Name is required"),
  code: yup.string().required(" Code is required"),
  start_date: yup.date().notRequired(), // Start date field
  end_date: yup.date().notRequired(),
  name: yup.string().required(" Name is required"),
  sku: yup.string().required("SKU is required"),
  unit: yup.string().required("Unit is required"),
  bom_raw_materials: yup
    .array()
    .of(
      yup.object().shape({
        sku: yup.string().required("SKU is required"),
        name: yup.string().required("Product Name is required"),
        unit: yup.string().required("Unit is required"),

        quantity: yup
          .number()
          .required("Quantity is required")
          .positive("Quantity must be a positive number"),
      })
    )
    .required("At least one item must be added"),
});
export const createProductionSchema = yup.object({
  description: yup.string().notRequired(),
  production_date: yup.string().required("Date is required"),
  production_finished_goods: yup
    .array()
    .of(
      yup.object().shape({
        bom: yup.string().required("BOM is required"),
        price: yup
          .number()
          .required("Rate is required")
          .positive("price must be a positive number"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .positive("Quantity must be a positive number"),
        total_price: yup
          .number()
          .required("Item total is required")
          .positive("item total must be a positive number"),
      })
    )
    .required("At least one item must be added"),
});
export const createSalesSchema = yup.object({
  sale_date: yup.string().required("Date is required"),
  sale_saleables: yup
    .array()
    .of(
      yup.object().shape({
        sku: yup.string().required("SKU is required"),
        name: yup.string().required("Name is required"),
        remaining_qty: yup.string().required("Stock Quantity is required"),
        unit_price: yup
          .number()
          .required("Price is required")
          .positive("Price must be a positive number"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .positive("Quantity must be a positive number")
          .test("Insufficient Stock", "Insufficient Stock", function (value) {
            const { remaining_qty } = this.parent;
            return value <= parseFloat(remaining_qty);
          }),
        total_price: yup
          .number()
          .required("Item total is required")
          .positive("item total must be a positive number"),
      })
    )
    .required("At least one item must be added"),
});
export const createSaleableSchema = yup.object({
  name: yup.string().required(" Name is required"),
  sku: yup.string().required("SKU is required"),
  saleable_finished_goods: yup
    .array()
    .of(
      yup.object().shape({
        sku: yup.string().required("SKU is required"),
        name: yup.string().required("Name is required"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .positive("Quantity must be a positive number"),
      })
    )
    .required("At least one item must be added"),
});
