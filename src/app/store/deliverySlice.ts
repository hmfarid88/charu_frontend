import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface Product {
    id: string;
    orderId:number;
    date: string;
    retailer: string;
    orderNote: string;
    productName: string;
    saleRate: string;
    orderQty: string;
    username: string;

}

interface ProductState {
    products: Product[];
}

const initialState: ProductState = {
    products: [],
};

export const deliverySlice = createSlice({
    name: "deliveryProducts",
    initialState,
    reducers: {
        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find(
                (pro) =>
                    pro.username === action.payload.username &&
                    pro.retailer === action.payload.retailer &&
                    pro.productName === action.payload.productName

            );
            if (exist) {
                // Add the orderQty to the existing product's quantity
                exist.orderQty = (
                    parseFloat(exist.orderQty) + parseFloat(action.payload.orderQty)
                ).toString();
            } else {
                state.products.push(action.payload);
            }
        },

        deleteProduct: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },
        deleteAllProducts: (state) => {
            state.products = [];
        },
    },
});

export const { addProducts, deleteProduct, deleteAllProducts } = deliverySlice.actions;

export default deliverySlice.reducer;

