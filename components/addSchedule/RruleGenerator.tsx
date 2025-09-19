import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

// --- Constants --- (from web project)
const FREQ_OPTIONS = {
    NONE: '',
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
    YEARLY: 'YEARLY',
};

const TERMINATION_TYPES = {
    NONE: 'none',
    COUNT: 'count',
    UNTIL: 'until',
};

const WEEKDAYS = [
    { label: '월', value: 'MO' },
    { label: '화', value: 'TU' },
    { label: '수', value: 'WE' },
    { label: '목', value: 'TH' },
    { label: '금', value: 'FR' },
    { label: '토', value: 'SA' },
    { label: '일', value: 'SU' },
];

const sortWeekdays = (days: string[]) => WEEKDAYS.map(d => d.value).filter(day => days.includes(day));

// --- State Interface ---
interface RuleState {
    freq: string;
    interval: number;
    byday: string[];
    terminationType: string;
    count: number;
    until: string; // YYYY-MM-DD format
}

// --- Props Interface ---
interface RRuleGeneratorProps {
  initialRRule?: string;
  onChange: (rruleString: string) => void;
  // startTime is no longer needed here as we are not using the rrule library constructor
}

// --- Manual RRule Logic from Web Project ---
const parseRRule = (rruleString?: string): RuleState => {
    const initialState: RuleState = {
        freq: FREQ_OPTIONS.NONE,
        interval: 1,
        byday: [],
        terminationType: TERMINATION_TYPES.NONE,
        count: 10,
        until: '',
    };

    if (!rruleString) return initialState;

    const rules = rruleString.split(';').reduce((acc, rule) => {
        const [key, val] = rule.split('=');
        if (key && val) acc[key] = val;
        return acc;
    }, {} as Record<string, string>);

    let terminationType = TERMINATION_TYPES.NONE;
    let count = initialState.count;
    let until = initialState.until;

    if (rules.COUNT) {
        terminationType = TERMINATION_TYPES.COUNT;
        count = parseInt(rules.COUNT, 10);
    } else if (rules.UNTIL) {
        terminationType = TERMINATION_TYPES.UNTIL;
        const untilDateStr = rules.UNTIL.split('T')[0];
        if (untilDateStr && untilDateStr.length === 8) {
            until = `${untilDateStr.slice(0, 4)}-${untilDateStr.slice(4, 6)}-${untilDateStr.slice(6, 8)}`;
        }
    }

    const rawByday = rules.BYDAY ? rules.BYDAY.split(',') : [];

    return {
        freq: rules.FREQ || FREQ_OPTIONS.NONE,
        interval: parseInt(rules.INTERVAL, 10) || 1,
        byday: sortWeekdays(rawByday),
        terminationType,
        count,
        until,
    };
};

const generateRRule = (state: RuleState): string => {
    const { freq, interval, byday, terminationType, count, until } = state;
    if (!freq) return '';

    let newRruleParts = [`FREQ=${freq}`];

    if (interval > 1) {
        newRruleParts.push(`INTERVAL=${interval}`);
    }

    if (freq === FREQ_OPTIONS.WEEKLY && byday.length > 0) {
        newRruleParts.push(`BYDAY=${byday.join(',')}`);
    }

    switch (terminationType) {
        case TERMINATION_TYPES.COUNT:
            newRruleParts.push(`COUNT=${count}`);
            break;
        case TERMINATION_TYPES.UNTIL:
            if (until) {
                const utcDate = until.replace(/-/g, '') + 'T235959Z';
                newRruleParts.push(`UNTIL=${utcDate}`);
            }
            break;
        default:
            break;
    }
    return newRruleParts.join(';');
};

// --- Component ---
const RRuleGenerator: React.FC<RRuleGeneratorProps> = ({ initialRRule, onChange }) => {
    const [state, setState] = useState<RuleState>(() => parseRRule(initialRRule));
    const [showUntilPicker, setShowUntilPicker] = useState(false);

    useEffect(() => {
        const newRrule = generateRRule(state);
        onChange(newRrule);
    }, [state, onChange]);

    const handleStateChange = (newState: Partial<RuleState>) => {
        setState(prev => ({ ...prev, ...newState }));
    }

    const handleFreqChange = (newFreq: string) => {
        handleStateChange({
            freq: newFreq,
            interval: 1,
            byday: newFreq === FREQ_OPTIONS.WEEKLY ? state.byday : [],
        });
    };

    const handleDayClick = (dayValue: string) => {
        const newByday = state.byday.includes(dayValue)
            ? state.byday.filter(d => d !== dayValue)
            : [...state.byday, dayValue];
        handleStateChange({ byday: sortWeekdays(newByday) });
    };

    const onUntilChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowUntilPicker(Platform.OS === 'ios');
        if (selectedDate) {
            handleStateChange({ until: format(selectedDate, 'yyyy-MM-dd'), terminationType: TERMINATION_TYPES.UNTIL });
        }
    };

    const freqLabel = useMemo(() => {
        switch (state.freq) {
            case FREQ_OPTIONS.DAILY: return '일';
            case FREQ_OPTIONS.WEEKLY: return '주';
            case FREQ_OPTIONS.MONTHLY: return '개월';
            case FREQ_OPTIONS.YEARLY: return '년';
            default: return '';
        }
    }, [state.freq]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>반복 설정</Text>
            <Picker selectedValue={state.freq} onValueChange={handleFreqChange}>
                <Picker.Item label="반복 안 함" value={FREQ_OPTIONS.NONE} />
                <Picker.Item label="매일" value={FREQ_OPTIONS.DAILY} />
                <Picker.Item label="매주" value={FREQ_OPTIONS.WEEKLY} />
                <Picker.Item label="매월" value={FREQ_OPTIONS.MONTHLY} />
                <Picker.Item label="매년" value={FREQ_OPTIONS.YEARLY} />
            </Picker>

            {state.freq && (
                <View>
                    <View style={styles.optionRow}>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            defaultValue={state.interval.toString()}
                            onChangeText={text => handleStateChange({ interval: Math.max(1, parseInt(text, 10) || 1) })}
                        />
                        <Text>{freqLabel}마다 반복</Text>
                    </View>

                    {state.freq === FREQ_OPTIONS.WEEKLY && (
                        <View style={styles.weekDayContainer}>
                            {WEEKDAYS.map(day => (
                                <TouchableOpacity
                                    key={day.value}
                                    style={[styles.dayButton, state.byday.includes(day.value) && styles.dayButtonSelected]}
                                    onPress={() => handleDayClick(day.value)}>
                                    <Text style={[styles.dayButtonText, state.byday.includes(day.value) && styles.dayButtonTextSelected]}>{day.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Monthly options are not implemented as per the web code */}

                    <Picker selectedValue={state.terminationType} onValueChange={type => handleStateChange({ terminationType: type }) }>
                        <Picker.Item label="계속 반복" value={TERMINATION_TYPES.NONE} />
                        <Picker.Item label="횟수 지정" value={TERMINATION_TYPES.COUNT} />
                        <Picker.Item label="종료 날짜 지정" value={TERMINATION_TYPES.UNTIL} />
                    </Picker>

                    {state.terminationType === TERMINATION_TYPES.COUNT && (
                        <View style={styles.optionRow}>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                defaultValue={state.count.toString()}
                                onChangeText={text => handleStateChange({ count: Math.max(1, parseInt(text, 10) || 1), terminationType: TERMINATION_TYPES.COUNT })}
                            />
                            <Text>번 반복</Text>
                        </View>
                    )}

                    {state.terminationType === TERMINATION_TYPES.UNTIL && (
                        <View style={styles.optionRow}>
                            <TouchableOpacity onPress={() => setShowUntilPicker(true)} style={styles.dateButton}>
                                <Text>{state.until || '날짜 선택'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {showUntilPicker && (
                        <DateTimePicker
                            value={state.until ? new Date(state.until) : new Date()}
                            mode="date"
                            display="default"
                            onChange={onUntilChange}
                        />
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
  },
  input: {
      borderWidth: 1,
      borderColor: '#ddd',
      backgroundColor: 'white',
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginHorizontal: 10,
      minWidth: 50,
      textAlign: 'center'
  },
  weekDayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  dayButtonSelected: {
    backgroundColor: 'mediumslateblue',
    borderColor: 'mediumslateblue',
  },
  dayButtonText: {
    color: '#333',
  },
  dayButtonTextSelected: {
      color: 'white',
  },
  dateButton: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd',
  }
});

export default RRuleGenerator;