import React, { createContext, useState, ReactNode,useContext } from "react";


export type Category = {
    name: string;
    selected: boolean;
};

export type FilterState = {
    categories: Category[];
    minAmount: number | null;
    maxAmount: number | null;
    startDate: string | null;
    endDate: string | null;
};
export type ChooseCatState={
    name:string,
    chosed:boolean
}
export type ExpenseItems = {
    _id: string;
    date: Date;     
    category: string;
    text?: string;
    amount: number;
    user: string;
};
export type ExpenseState=ExpenseItems[];

export type dateRangeState = {
    startDate: string | null;
    endDate: string | null;
};

export type UserDetails = {
    name: string;
    email: string;
    photo: string;
};

type FilterContextType = {
    isloggedin: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
   
    user: UserDetails | null;
    setUser: React.Dispatch<React.SetStateAction<UserDetails | null>>;
    expenseData: ExpenseState,
    setExpenseData: React.Dispatch<React.SetStateAction<ExpenseState>>;
    choosecat: ChooseCatState[];
    setChooseCat: React.Dispatch<React.SetStateAction<ChooseCatState[]>>;

    daterange:dateRangeState,
    setDateRange: React.Dispatch<React.SetStateAction<dateRangeState>>;
    totalamount: number | null;
    setTotalAmount: React.Dispatch<React.SetStateAction<number | null>>;
    filters: FilterState;
    toggleCategory: (categoryName: string) => void;
    setCategories: (categories: string[]) => void;
    toggleChooseCategory:(Category:string)=>void;
    setMinAmount: (value: number | null) => void;
    setMaxAmount: (value: number | null) => void;
    setStartDate: (date: string | null) => void;
    setEndDate: (date: string | null) => void;
   

};

export const FilterContext = createContext<FilterContextType | undefined>(
    undefined
);

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilter must be used inside FilterProvider");
    }
    return context;
};

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [isloggedin, setIsLoggedIn] = useState<boolean>(false);
    
    const [user, setUser] = useState<UserDetails | null>(null);
    const [expenseData,setExpenseData]=useState<ExpenseState>([]);
    const [daterange, setDateRange] = useState<dateRangeState>({
        startDate: null,
        endDate: null,
    });
    const [totalamount, setTotalAmount] = useState<number | null>(null);
    const [choosecat,setChooseCat]=useState<ChooseCatState[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        minAmount: null,
        maxAmount: null,
        startDate: null,
        endDate: null,
    });

    const toggleCategory = (categoryName: string) => {
        setFilters((prev) => {
           
            if (categoryName === "All") {
                const isAllSelected = prev.categories.find((cat) => cat.name === "All")?.selected;
                if (isAllSelected) return prev;

                return {
                    ...prev,
                    categories: prev.categories.map((cat) => ({
                        ...cat,
                        selected: cat.name === "All"?true:false, 
                    })),
                };
            }

            // Case 2: Clicked on other categories
            let updatedCategories = prev.categories.map((cat) =>(
                cat.name === categoryName ? { ...cat, selected: !cat.selected } : cat
            ));

            const anyOtherSelected = updatedCategories.some(
                (cat) => (cat.name !== "All" && cat.selected
            ));

            updatedCategories = updatedCategories.map((cat) => {
                
                    return { ...cat, selected:cat.name==="All"?!anyOtherSelected:cat.selected }; 
                
            });

            return {
                ...prev,
                categories: updatedCategories,
            };
        });
    };


    const setCategories = (categories: string[]) => {
        setFilters((prev) => ({
            ...prev,
            categories: categories.map((cat) => ({
                name: cat.trim(),
                selected: cat.trim()==='All'?true:false, 
            })),
        }));

        setChooseCat(
            categories
                .filter((cat) => cat.trim() !== "All") 
                .map((cat) => ({
                    name: cat.trim(),
                    chosed: cat.trim() ==="Grocery 🛒",
                }))
        );
    };

    const toggleChooseCategory=(category:string)=>{
       
        setChooseCat((prev) =>
            prev.map((cat) => {
                if (cat.name === category) {
                    return { ...cat, chosed: true };
                } else {
                   
                    return { ...cat, chosed: false };
                }
            })
        );
         
    }

    const setMinAmount = (value: number | null) =>
        setFilters((prev) => ({ ...prev, minAmount: value }));

    const setMaxAmount = (value: number | null) =>
        setFilters((prev) => ({ ...prev, maxAmount: value }));

    const setStartDate = (date: string | null) =>
        setFilters((prev) => ({ ...prev, startDate: date }));

    const setEndDate = (date: string | null) =>
        setFilters((prev) => ({ ...prev, endDate: date }));


    

    return (
        <FilterContext.Provider
            value={{
                isloggedin,
                setIsLoggedIn,
                
                user,
                setUser,
                expenseData,
                setExpenseData,
                choosecat,
                setChooseCat,
                daterange,
                setDateRange,
                totalamount,
                setTotalAmount,
                filters,
                toggleCategory,
                setCategories,
                toggleChooseCategory,
                setMinAmount,
                setMaxAmount,
                setStartDate,
                setEndDate,
                
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};
