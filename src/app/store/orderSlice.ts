import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';

interface Product {
    id: string;
    date: string;
    retailer: string;
    orderNote: string;
    productName: string;
    saleRate: string;
    orderQty: string;
    deliveredQty: number;
    username: string;

}

interface ProductState {
    products: Product[];
}

const initialState: ProductState = {
    products: [],
};

export const orderSlice = createSlice({
    name: "orderProducts",
    initialState,
    reducers: {
        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.saleRate===action.payload.saleRate && pro.productName === action.payload.productName && pro.username === action.payload.username)
            if (exist) {
                exist.orderQty += action.payload.orderQty;
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

export const { addProducts, deleteProduct, deleteAllProducts } = orderSlice.actions;

export default orderSlice.reducer;

