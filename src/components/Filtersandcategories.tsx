import { StyleSheet, TouchableOpacity, Text, ScrollView, View, TextInput, } from 'react-native';
import React, { useState } from 'react';
import { useFilter } from '../Context';

export default function FiltersAndCategories() {
    const { toggleCategory, filters, setMinAmount, setMaxAmount, setStartDate, setEndDate } = useFilter();

    const [minprice, setMinPrice] = useState<string>('');
    const [maxprice, setMaxPrice] = useState<string>('');
    const [startdateinput, setStartDateInput] = useState<string>('');
    const [enddateinput, setEndDateInput] = useState<string>('');

    const [minPriceError, setMinPriceError] = useState<string>('');
    const [maxPriceError, setMaxPriceError] = useState<string>('');
    const [startDateError, setStartDateError] = useState<string>('');
    const [endDateError, setEndDateError] = useState<string>('');

    // Handle price filter immediately
    const handleApplyPriceOnChange = (min: string, max: string) => {
        let valid = true;
        const minValue = min ? Number(min) : null;
        const maxValue = max ? Number(max) : null;

        if (minValue !== null && isNaN(minValue)) {
            setMinPriceError("Invalid number");
            valid = false;
        } else if (minValue !== null && minValue < 0) {
            setMinPriceError("Cannot be negative");
            valid = false;
        } else {
            setMinPriceError("");
        }

        if (maxValue !== null && isNaN(maxValue)) {
            setMaxPriceError("Invalid number");
            valid = false;
        } else if (maxValue !== null && maxValue < 0) {
            setMaxPriceError("Cannot be negative");
            valid = false;
        } else {
            setMaxPriceError("");
        }

        // Validate min ≤ max
        if (
            minValue !== null &&
            maxValue !== null &&
            !isNaN(minValue) &&
            !isNaN(maxValue) &&
            minValue > maxValue
        ) {
            setMinPriceError("Cannot be greater than Max");
            setMaxPriceError("Cannot be less than Min");
            valid = false;
        }

        setMinAmount(valid ? minValue : null);
        setMaxAmount(valid ? maxValue : null);

    };

    // Handle date filter immediately
    const handleApplyDateOnChange = (start: string, end: string) => {
        const validateDate = (dateStr: string) => {
            const regex =
                /^([1-9]|0?[1-9]|[12][0-9]|3[01])\/([1-9]|0?[1-9]|1[0-2])\/(\d{4})$/;
            return regex.test(dateStr);
        };

        let valid = true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let startDateObj: Date | null = null;
        let endDateObj: Date | null = null;

        // ✅ Validate start date
        if (start) {
            if (!validateDate(start)) {
                setStartDateError("Invalid date");
                valid = false;
            } else {
                const [sd, sm, sy] = start.split("/").map(Number);
                startDateObj = new Date(sy, sm - 1, sd);

                if (startDateObj > today) {
                    setStartDateError("Start date cannot be in the future");
                    valid = false;
                } else {
                    setStartDateError("");
                }
            }
        } else {
            setStartDateError("");
        }

        // ✅ Validate end date
        if (end) {
            if (!validateDate(end)) {
                setEndDateError("Invalid date");
                valid = false;
            } else {
                const [ed, em, ey] = end.split("/").map(Number);
                endDateObj = new Date(ey, em - 1, ed);

                if (endDateObj > today) {
                    setEndDateError("End date cannot be in the future");
                    valid = false;
                } else {
                    setEndDateError("");
                }
            }
        } else {
            setEndDateError("");
        }

        // ✅ Cross-check only if both are valid
        if (startDateObj && endDateObj && startDateObj > endDateObj) {
            setStartDateError("Cannot be after End date");
            setEndDateError("Cannot be before Start date");
            valid = false;
        }

        const formatDate = (d: string | null) => {
            if (!d) return null;
            const [day, month, year] = d.split("/").map(Number);
            return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
                2,
                "0"
            )}`;
        };

        setStartDate(valid && start ? formatDate(start) : null);
        setEndDate(valid && end ? formatDate(end) : null);
    };


    return (
        <>
            {/* Categories Scroll */}
            <View style={styles.scrollWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.catContentContainer}
                >
                    {filters.categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.name}
                            onPress={() => toggleCategory(cat.name)}
                            style={[styles.catbutton, cat.selected && styles.selectedButton]}
                        >
                            <Text style={[styles.catText, cat.selected && styles.selectedText]}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Filter Inputs */}
            <View style={styles.filtermaincontainer}>
                {/* Price Filter */}
                <View style={styles.filtercontainer}>
                    <View style={styles.inputwrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Min Price"
                            keyboardType="numeric"
                            placeholderTextColor="#888"
                            value={minprice}
                            onChangeText={(text) => {
                                setMinPrice(text);
                                handleApplyPriceOnChange(text, maxprice);
                            }}
                        />
                        {minPriceError ? <Text style={styles.error}>{minPriceError}</Text> : null}
                    </View>

                    <View style={styles.inputwrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Max Price"
                            keyboardType="numeric"
                            placeholderTextColor="#888"
                            value={maxprice}
                            onChangeText={(text) => {
                                setMaxPrice(text);
                                handleApplyPriceOnChange(minprice, text);
                            }}
                        />
                        {maxPriceError ? <Text style={styles.error}>{maxPriceError}</Text> : null}
                    </View>
                </View>

                {/* Date Filter */}
                <View style={styles.filtercontainer}>
                    <View style={styles.inputwrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor="#888"
                            value={startdateinput}
                            onChangeText={(text) => {
                                setStartDateInput(text);
                                handleApplyDateOnChange(text, enddateinput);
                            }}
                        />
                        {startDateError ? <Text style={styles.error}>{startDateError}</Text> : null}
                    </View>

                    <View style={styles.inputwrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor="#888"
                            value={enddateinput}
                            onChangeText={(text) => {
                                setEndDateInput(text);
                                handleApplyDateOnChange(startdateinput, text);
                            }}
                        />
                        {endDateError ? <Text style={styles.error}>{endDateError}</Text> : null}
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    scrollWrapper: {
        height: 60,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginVertical: 5,
        marginHorizontal: 3,
        borderRadius: 15,
    },
    catContentContainer: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    catbutton: {
        backgroundColor: 'grey',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 15,
        marginHorizontal: 4,
        justifyContent: 'center',
    },
    selectedButton: {
        backgroundColor: 'blue',
    },
    catText: {
        color: 'black',
        fontSize: 14,
    },
    selectedText: {
        color: 'white',
        fontWeight: '700',
    },
    filtermaincontainer: {
        minHeight: 140,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        marginHorizontal: 3,
        marginVertical: 5,
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 8,
    },
    filtercontainer: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    inputwrapper: {
        width: '40%',
        justifyContent: 'flex-start',
    },
    input: {
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    error: {
        color: 'red',
    },
});
