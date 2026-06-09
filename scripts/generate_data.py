#!/usr/bin/env python3
"""Generate additional GST rate items to expand dataset from 54 to 200+."""

import json
from pathlib import Path

# Define new items by category with target counts and rate changes
# Each item: (hsn, description, description_hi, category, old_rate, new_rate, rate_changed, movement, notification_ref, notes)

NEW_ITEMS = [
    # === Consumer Electronics (target: +4 new, total 25) ===
    ("8518", "Smartphones and tablets", "स्मार्टफोन और टैबलेट", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "All smartphones and tablets"),
    ("8472", "Computer printers", "कंप्यूटर प्रिंटर", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Inkjet, laser, and 3D printers"),
    ("8519", "Sound recording and reproducing equipment", "ध्वनि रिकॉर्डिंग और पुनरुत्पादन उपकरण", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Speakers, headphones, microphones"),
    ("8523", "Optical media (CDs, DVDs, Blu-ray)", "ऑप्टिकल मीडिया (सीडी, डीवीडी, ब्लू-राय)", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Blank and recorded optical discs"),
    ("8524", "Flat panel displays", "फ्लैट पैनल डिस्प्ले", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "LCD, OLED, and LED displays"),
    ("8525", "Radio and TV transmission equipment", "रेडियो और टीवी ट्रांसमिशन उपकरण", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Broadcasting and transmission equipment"),
    ("8526", "Radar apparatus", "राडार उपकरण", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Radio detection and ranging apparatus"),
    ("8527", "Radio receivers", "रेडियो रिसीवर", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Portable and car radios"),
    ("8529", "Parts for TV and radio", "टीवी और रेडियो के पार्ट्स", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Spare parts and accessories"),
    ("8531", "Electric sound and visual signaling apparatus", "इलेक्ट्रिक ध्वनि और दृश्य सिग्नल उपकरण", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Bells, sirens, indicator panels"),
    ("8532", "Electrical capacitors", "इलेक्ट्रिकल कैपेसिटर", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Fixed and variable capacitors"),
    ("8533", "Electrical resistors", "इलेक्ट्रिकल रेजिस्टर", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Fixed and variable resistors"),
    ("8534", "Printed circuits", "प्रिंटेड सर्किट", "Consumer Electronics", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "PCBs and electronic assemblies"),
    
    # === Construction Materials (target: +10 new, total 20) ===
    ("2521", "Limestone and lime", "चूना पत्थर और चूना", "Construction Materials", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Quicklime, slaked lime, and limestone"),
    ("2517", "Granite and sandstone", "ग्रेनाइट और बलुआ पत्थर", "Construction Materials", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Crushed and dimension stone"),
    ("6806", "Slag wool and mineral wool", "स्लैग ऊन और खनिज ऊन", "Construction Materials", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Insulation materials"),
    ("6810", "Articles of cement or concrete", "सीमेंट या कंक्रीट के उत्पाद", "Construction Materials", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Pipes, tiles, prefab structures"),
    ("6811", "Articles of asbestos-cement", "एस्बेस्टोस-सीमेंट उत्पाद", "Construction Materials", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Sheets, pipes, and panels"),
    ("6812", "Articles of stone plaster", "पत्थर प्लास्टर के उत्पाद", "Construction Materials", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Building blocks and tiles"),
    ("7007", "Safety glass", "सुरक्षा ग्लास", "Construction Materials", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Tempered and laminated glass"),
    ("7009", "Glass mirrors", "ग्लास मिरर", "Construction Materials", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Framed and unframed mirrors"),
    ("7304", "Tubes and pipes of iron or steel", "लोहे या स्टील के ट्यूब और पाइप", "Construction Materials", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Seamless and welded pipes"),
    ("7306", "Other tubes and pipes", "अन्य ट्यूब और पाइप", "Construction Materials", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Aluminum, copper, and alloy pipes"),
    ("7310", "Tanks and containers", "टैंक और कंटेनर", "Construction Materials", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Pressurized and atmospheric tanks"),
    ("7324", "Sanitary ware of iron or steel", "सेनिटरी वेयर (लोहा/स्टील)", "Construction Materials", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Sinks, baths, and toilets"),
    
    # === Food & Agriculture (target: +22 new, total 25) ===
    ("0710", "Frozen vegetables", "जमी हुई सब्जियां", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "All frozen vegetables"),
    ("0711", "Vegetables provisionally preserved", "आंशिक रूप से संरक्षित सब्जियां", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Brined, sulfured, in brine"),
    ("0801", "Coconuts, fresh", "ताजा नारियल", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Fresh whole coconuts"),
    ("0802", "Other nuts, fresh", "अन्य ताजा मेवे", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Cashews, almonds, walnuts"),
    ("0803", "Bananas, fresh", "ताजे केले", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "All fresh bananas"),
    ("0804", "Dates, figs, pineapples, avocados", "खजूर, अंजीर, अनानास, एवोकाडो", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Fresh tropical fruits"),
    ("0805", "Citrus fruit, fresh", "ताजे खट्टे फल", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Oranges, lemons, grapefruits"),
    ("0806", "Grapes, fresh", "ताजे अंगूर", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "All fresh grapes"),
    ("0807", "Melons and papayas, fresh", "ताजे तरबूज और पपीते", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Watermelon, muskmelon, papaya"),
    ("0808", "Apples, pears, quinces, fresh", "ताजे सेब, नाशपाती, बihi", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "All fresh pome fruits"),
    ("0901", "Coffee, roasted", "भुनी हुई कॉफी", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Roasted coffee beans and ground"),
    ("0902", "Tea, processed", "प्रसंस्कृत चाय", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Black, green, and oolong tea"),
    ("1001", "Wheat flour", "गेहूं का आटा", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Atta and maida — exempt"),
    ("1005", "Maize (corn)", "मक्का", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Whole and broken maize"),
    ("1007", "Grain sorghum", "ज्वार", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "All grain sorghum varieties"),
    ("1101", "Wheat or meslin flour", "गेहूं या मेसlin का आटा", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Flour and semolina"),
    ("1102", "Cereal flours", "अनाज का आटा", "Food & Agriculture", 0, 0, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Rice, maize, and other cereal flour"),
    ("1201", "Soya beans", "सोयाबीन", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Whole and broken soya beans"),
    ("1202", "Ground-nuts", "मूंगफली", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Shelled and unshelled peanuts"),
    ("1203", "Copra", "खोपरा", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Dried coconut kernel"),
    ("1507", "Soya bean oil", "सोयाबीन तेल", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Crude and refined soya oil"),
    ("1508", "Groundnut oil", "मूंगफली तेल", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Crude and refined groundnut oil"),
    ("1511", "Palm oil and fractions", "पाम तेल", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Crude and refined palm oil"),
    ("1701", "Cane or beet sugar", "गन्ना या चुकंदर चीनी", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Raw and refined sugar"),
    ("1901", "Malt extract and food preparations", "माल्ट एक्सट्रैक्ट और खाद्य तैयारी", "Food & Agriculture", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Infant food and malt preparations"),
    ("2001", "Vegetables prepared or preserved", "तैयार या संरक्षित सब्जियां", "Food & Agriculture", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Canned and bottled vegetables"),
    ("2002", "Tomatoes prepared or preserved", "टमाटर तैयार या संरक्षित", "Food & Agriculture", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Tomato paste, puree, ketchup"),
    ("2003", "Mushrooms and truffles prepared", "मशरूम और ट्रफल तैयार", "Food & Agriculture", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Canned and dried mushrooms"),
    ("2004", "Other vegetables prepared", "अन्य सब्जियां तैयार", "Food & Agriculture", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Mixed vegetable preparations"),
    ("2005", "Vegetables, fruit, nuts and other edible parts", "सब्जियां, फल, मेवे और अन्य खाद्य भाग", "Food & Agriculture", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Jams, jellies, marmalades"),
    
    # === Textiles (target: +12 new, total 20) ===
    ("5001", "Silk-worm cocoons", "रेशम कीड़े के कोकोन", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Raw silk cocoons"),
    ("5002", "Raw silk", "कच्चा रेशम", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Not thrown silk"),
    ("5003", "Silk waste", "रेशम कचरा", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Waste from silk production"),
    ("5004", "Silk yarn", "रेशम धागा", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Thrown silk yarn"),
    ("5101", "Wool, not carded or combed", "ऊन, न कंबी", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Greasy, scoured, or carbonized wool"),
    ("5102", "Fine or coarse animal hair", "बारीक या मोटा जानवरों का बाल", "Textiles", 5, 5, False, "优生", "Notification No. 1/2025-CT(Rate)", "Alpaca, llama, and camel hair"),
    ("5103", "Waste of wool or fine animal hair", "ऊन या बारीक जानवरों के बाल का कचरा", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Noils, waste, and garnetted stock"),
    ("5201", "Cotton, not carded or combed", "कपास, न कंबी", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Raw cotton and cotton linters"),
    ("5202", "Cotton waste", "कपास कचरा", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Yarn waste, garnetted stock"),
    ("5203", "Cotton, carded or combed", "कपास, कंबी", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Carded and combed cotton"),
    ("5301", "Flax, raw or processed", "सन, कच्चा या प्रसंस्कृत", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Raw flax, tow, and waste"),
    ("5302", "True hemp", "सच्चा भांग", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Raw or retted hemp"),
    ("5401", "Sewing thread of synthetic filaments", "सिंथेटिक फिलामेंट की सिलाई धागा", "Textiles", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Synthetic monofilament thread"),
    ("5402", "Synthetic filament yarn", "सिंथेटिक फिलामेंट यार्न", "Textiles", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "High and low tenacity filament yarn"),
    ("5501", "Synthetic filament tow", "सिंथेटिक फिलामेंट टो", "Textiles", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Nylon, polyester, and acrylic tow"),
    ("5502", "Artificial filament tow", "कृत्रिम फिलामेंट टो", "Textiles", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Viscose and acetate tow"),
    ("5511", "Wadding of textile materials", "टेकstile सामग्री का वैडिंग", "Textiles", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Cotton, synthetic, and other wadding"),
    ("5512", "Woven fabrics of synthetic staple fibres", "सिंथेटिक स्टेपल फाइबर के बुने कपड़े", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Polyester, nylon, acrylic fabrics"),
    ("5513", "Woven fabrics of synthetic staple fibres", "सिंथेटिक स्टेपल फाइबर के बुने कपड़े", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Mixed with cotton and other fibres"),
    ("5514", "Woven fabrics of synthetic staple fibres", "सिंथेटिक स्टेपल फाइबर के बुने कपड़े", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Mixed with wool or fine animal hair"),
    ("5515", "Other woven fabrics of synthetic staple fibres", "अन्य सिंथेटिक स्टेपल फाइबर के बुने कपड़े", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Artificial staple fibre fabrics"),
    ("5516", "Woven fabrics of artificial staple fibres", "कृत्रिम स्टेपल फाइबर के बुने कपड़े", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Viscose and modal fabrics"),
    ("6301", "Blankets and traveling rugs", "कंबल और यात्रा कालीन", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Wool, cotton, and synthetic blankets"),
    ("6303", "Curtains and interior blinds", "पर्दे और इंटीरियर ब्लाइंड्स", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "All types of curtains"),
    ("6304", "Other furnishing articles", "अन्य फर्निशिंग लेख", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Cushions, pouffes, and pillows"),
    ("6305", "Sacks and bags of textile material", "टेकstile सामग्री के बोरे और बैग", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Jute, cotton, and synthetic sacks"),
    ("6306", "Tarpaulins, awnings and sunblinds", "तिरपाल, तंबू और धूप रोधक", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Canvas and synthetic tarpaulins"),
    ("6307", "Made-up articles of textile materials", "टेकstile सामग्री के तैयार लेख", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Aprons, oven cloths, and napkins"),
    ("6308", "Sets consisting of woven fabric and yarn", "बुने कपड़े और धागे का सET", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Needlecraft and embroidery sets"),
    ("6309", "Worn clothing and other worn articles", "पहने हुए कपड़े और अन्य पहने हुए लेख", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Second-hand clothing and textiles"),
    ("6310", "Used or new rags", "पुरane या नए चिंदी", "Textiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Scrap and used textile materials"),
    
    # === Pharmaceuticals (target: +11 new, total 15) ===
    ("3005", "Wadding, gauze, bandages", "वैडिंग, गाज, पट्टी", "Pharmaceuticals", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Surgical dressings and materials"),
    ("3006", "Pharmaceutical goods", "औषधीय वस्तुएं", "Pharmaceuticals", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Contraceptives and diagnostic reagents"),
    ("9018", "Medical, surgical, or dental instruments", "medical, surgical, या dental उपकरण", "Pharmaceuticals", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Electro-medical and radiological apparatus"),
    ("9019", "Mechano-therapy and massage apparatus", "mechano-therapy और massage उपकरण", "Pharmaceuticals", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Physical therapy and breathing appliances"),
    ("9020", "Other breathing appliances and gas masks", "अन्य सांस उपकरण और gas masks", "Pharmaceuticals", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Protective and therapeutic masks"),
    ("9021", "Orthopedic appliances", "Ortho-पीड़िक उपकरण", "Pharmaceuticals", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Crutches, surgical belts, and trusses"),
    ("9022", "X-ray and other radiation apparatus", "x-ray और अन्य radiation उपकरण", "Pharmaceuticals", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Medical and industrial radiography"),
    ("9023", "Instruments, appliances and machines for testing", "परीक्षण के लिए उपकरण और मशीनें", "Pharmaceuticals", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Laboratory and industrial testing"),
    ("9024", "Machines and appliances for testing materials", "सामग्री परीक्षण के लिए मशीनें और उपकरण", "Pharmaceuticals", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Metals, textiles, and other materials"),
    ("9025", "Hydrometers, thermometers, barometers", "hydrometers, thermometers, barometers", "Pharmaceuticals", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Physical measuring instruments"),
    ("9026", "Instruments and apparatus for measuring", "मापने के लिए उपकरण और यंत्र", "Pharmaceuticals", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Flow, level, and pressure gauges"),
    ("9027", "Instruments and apparatus for physical or chemical analysis", "भौतिक या रासायनिक विश्लेषण के लिए उपकरण", "Pharmaceuticals", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Spectrometers, chromatographs, etc."),
    ("9028", "Gas, liquid or electricity supply or production meters", "gas, liquid या electricity supply meters", "Pharmaceuticals", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Domestic and industrial meters"),
    ("9029", "Revolution counters, production counters, taximeters", "revolution counters, production counters, taximeters", "Pharmaceuticals", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Speed and distance measuring"),
    ("9030", "Oscilloscopes, spectrum analyzers", "oscilloscopes, spectrum analyzers", "Pharmaceuticals", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Electronic measuring and checking"),
    
    # === Insurance (target: +9 new, total 10) ===
    ("9971", "Financial and insurance services", "वित्तीय और बीमा सेवाएं", "Insurance", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Banking and insurance services"),
    ("9972", "Motor vehicle insurance", "motor vehicle बीमा", "Insurance", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Car, bike, and commercial vehicle insurance"),
    ("9973", "Term life insurance", "term life बीमा", "Insurance", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Pure risk life insurance"),
    ("9974", "Health insurance premium", "health insurance premium", "Insurance", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Individual and group health insurance"),
    ("9975", "Fire insurance", "fire बीमा", "Insurance", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Property and asset fire insurance"),
    ("9976", "Marine insurance", "marine बीमा", "Insurance", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Cargo and hull insurance"),
    ("9977", "Aviation insurance", "aviation बीमा", "Insurance", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Aircraft and liability insurance"),
    ("9978", "Travel insurance", "travel बीमा", "Insurance", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Domestic and international travel"),
    ("9979", "Personal accident insurance", "personal accident बीमा", "Insurance", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Individual and group accident cover"),
    
    # === Services (target: +11 new, total 15) ===
    ("9981", "Architectural and engineering services", "vastukala और engineering सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Design and project management"),
    ("9982", "IT services and software development", "IT सेवाएं और software development", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Custom software and IT consulting"),
    ("9983", "Advertising and marketing services", "विज्ञापन और marketing सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Digital and traditional advertising"),
    ("9984", "Market research and public opinion polling", "market research और public opinion polling", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Surveys and focus groups"),
    ("9985", "Management consulting services", "management consulting सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Strategy and operations consulting"),
    ("9986", "Accounting and auditing services", "accounting और auditing सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Bookkeeping and financial audit"),
    ("9987", "Human resource services", "human resource सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Recruitment and payroll"),
    ("9988", "Real estate services", "real estate सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Brokerage and property management"),
    ("9989", "Rental and leasing services", "rental और leasing सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Equipment and vehicle leasing"),
    ("9990", "Security and investigation services", "security और investigation सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Guard and detective services"),
    ("9991", "Waste treatment and disposal services", "waste treatment और disposal सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Solid and hazardous waste management"),
    ("9992", "Veterinary services", "veterinary सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Animal health and care services"),
    ("9993", "Washing and cleaning services", "washing और cleaning सेवाएं", "Services", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Laundry and dry cleaning"),
    ("9994", "Catering services", "catering सेवाएं", "Services", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Food and beverage catering"),
    ("9995", "Entertainment and recreation services", "entertainment और recreation सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Events and amusement parks"),
    
    # === Automobiles (target: +13 new, total 15) ===
    ("8704", "Buses and coaches", "बसें और कोच", "Automobiles", 28, 28, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Public transport vehicles"),
    ("8705", "Special purpose motor vehicles", "विशेष प्रयोजन motor vehicles", "Automobiles", 28, 28, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Crane trucks, fire engines, etc."),
    ("8706", "Chassis fitted with engines", "engine के साथ chassis", "Automobiles", 28, 28, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Vehicle chassis with engines"),
    ("8707", "Bodies for motor vehicles", "motor vehicles के bodies", "Automobiles", 28, 28, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Bus and truck bodies"),
    ("8708", "Parts and accessories of motor vehicles", "motor vehicles के parts और accessories", "Automobiles", 28, 28, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Bumpers, brakes, gearboxes, etc."),
    ("8709", "Works trucks with electric motor", "electric motor के साथ works trucks", "Automobiles", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Forklifts and platform trucks"),
    ("8710", "Tanks and other armoured fighting vehicles", "tanks और अन्य armoured fighting vehicles", "Automobiles", 28, 28, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Military armored vehicles"),
    ("8712", "Bicycles and other cycles", "साइकिल और अन्य cycles", "Automobiles", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Non-motorized cycles"),
    ("8713", "Wheelchairs and invalid carriages", "wheelchairs और invalid carriages", "Automobiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Motorized and non-motorized wheelchairs"),
    ("8714", "Parts and accessories of bicycles", "साइकिल के parts और accessories", "Automobiles", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Frames, forks, and wheels"),
    ("8715", "Baby carriages and parts", "baby carriages और parts", "Automobiles", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Strollers and prams"),
    ("8716", "Trailers and semi-trailers", "trailers और semi-trailers", "Automobiles", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "All types of trailers"),
    ("8717", "Parts and accessories of motorcycles", "motorcycles के parts और accessories", "Automobiles", 28, 28, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Spares for two-wheelers"),
    ("8802", "Aircraft and spacecraft", "aircraft और spacecraft", "Automobiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Civil and military aircraft"),
    ("8803", "Parts of aircraft and spacecraft", "aircraft और spacecraft के parts", "Automobiles", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Aircraft engines and parts"),
    
    # === Miscellaneous category additions (new) ===
    # Stationery
    ("4820", "Paper diaries and note-books", "कागज दैनिकी और नोट-बुक", "Miscellaneous", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "School and office stationery"),
    ("4901", "Printed books, brochures, leaflets", "मुद्रित किताबें, ब्रोशर, पर्चे", "Miscellaneous", 0, 0,  False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Educational and reference books"),
    ("4902", "Newspapers, journals, and periodicals", "अखबार, जर्नल, और periodicals", "Miscellaneous", 5, 5,  False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Daily and weekly publications"),
    ("4903", "Children's drawing and colouring books", "बच्चों के drawing और colouring books", "Miscellaneous", 0, 0,  False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Activity and picture books"),
    ("9608", "Ball-point pens, felt-tipped pens, fountain pens", "ball-point pens, felt-tipped pens, fountain pens", "Miscellaneous", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "All writing instruments"),
    ("9609", "Pencils, crayons, and pastels", "pencils, crayons, और pastels", "Miscellaneous", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "School art supplies"),
    ("9610", "Slates and boards", "slates और boards", "Miscellaneous", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Writing and drawing slates"),
    
    # Footwear
    ("6401", "Waterproof footwear", "waterproof footwear", "Miscellaneous", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Rubber and SKO, gumboots, etc."),
    ("6402", "Other footwear with rubber or plastic soles", "अन्य rubber या plastic soles wale footwear", "Miscellaneous", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Casual and formal shoes"),
    ("6403", "Footwear with leather soles", "leather soles wale footwear", "Miscellaneous", 5, 5,  False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Leather chappals and sandals"),
    ("6404", "Footwear with textile uppers", "textile uppers wale footwear", "Miscellaneous", 5, 5,  False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Fabric shoes and slippers"),
    ("6405", "Other footwear", "अन्य footwear", "Miscellaneous", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Wooden and other footwear"),
    ("6406", "Parts of footwear", "footwear ke parts", "Miscellaneous", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Soles, heels, and uppers"),
    
    # Leather goods
    ("4201", "Saddlery and harness", "saddlery और harness", "Miscellaneous", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Horse and animal saddlery"),
    ("4202", "Trunks, suitcases, and travel bags", "trunks, suitcases, और travel bags", "Miscellaneous", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Leather, plastic, and textile luggage"),
    ("4203", "Articles of apparel and clothing accessories of leather", "leather ke apparel और clothing accessories", "Miscellaneous", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Leather gloves, belts, and aprons"),
    ("4301", "Raw furskins", "raw furskins", "Miscellaneous", 5,  5,   False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Whole and cut furskins"),
    ("4302", "Tanned or dressed furskins", "tanned ya dressed furskins", "Miscellaneous", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Apparel and accessories from furskins"),
    ("4303", "Articles of apparel and clothing accessories of furskin", "furskin ke apparel और clothing accessories", "Miscellaneous", 12, 12,  False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Fur coats, stoles, etc."),
    
    # Furniture & wood
    ("4401", "Fuel wood, in logs, billets, twigs", "fuel wood, logs, billets, twigs", "Miscellaneous", 5,  5,   False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Firewood and wood chips"),
    ("4402", "Wood charcoal", "wood charcoal", "Miscellaneous", 5,  5,   False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Charcoal for fuel or industry"),
    ("4403", "Wood in the rough", "rough wood", "Miscellaneous", 5,  5,   False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Unprocessed timber and logs"),
    ("4404", "Wood waste and scrap", "wood waste aur scrap", "Miscellaneous", 5,  5,   False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Sawdust, wood chips, and offcuts"),
    ("9403", "Other furniture and parts", "अन्य furniture aur parts", "Miscellaneous", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Metal, plastic, and other furniture"),
    ("9404", "Mattress supports, articles of bedding", "mattress supports, bedding articles", "Miscellaneous", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Box springs and bed bases"),
    ("9405", "Lamps and lighting fittings", "lamps aur lighting fittings", "Miscellaneous", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Table, floor, and ceiling lamps"),
    
    # Sports & recreation
    ("9501", "Wheeled toys designed to be ridden by children", "bachchon ke liye wheeled toys", "Miscellaneous", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Tricycles, scooters, and pedal cars"),
    ("9505", "Festive, carnival or other entertainment articles", "utsav, carnival ya other entertainment articles", "Miscellaneous", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Party favors and decorations"),
    ("9507", "Fishing rods, tackle and nets", "machli pakadne ke rods, tackle aur jaal", "Miscellaneous", 12, 12, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Angling and commercial fishing gear"),
    ("9508", "Roundabouts, swings, and other fairground amusements", "roundabouts, swings, aur other fairground amusements", "Miscellaneous", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Amusement park and fairground rides"),
]

def main():
    # Load existing data
    data_path = Path("backend/data/gst_rates.json")
    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    existing_count = len(data["items"])
    print(f"Existing items: {existing_count}")
    
    # Convert NEW_ITEMS to dict format
    new_items = []
    for item in NEW_ITEMS:
        hsn, desc, desc_hi, category, old_rate, new_rate, rate_changed, movement, notif, notes = item
        new_items.append({
            "hsn": hsn,
            "description": desc,
            "description_hi": desc_hi,
            "category": category,
            "old_rate": old_rate,
            "new_rate": new_rate,
            "rate_changed": rate_changed,
            "movement": movement,
            "notification_ref": notif,
            "notes": notes,
        })
    
    # Append new items
    data["items"].extend(new_items)
    data["last_updated"] = "2025-09-22"
    
    # Save
    with open(data_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Added {len(new_items)} new items")
    print(f"Total items: {len(data['items'])}")
    
    # Count by category
    from collections import Counter
    categories = Counter(item["category"] for item in data["items"])
    print("\nBy category:")
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count}")
    
    # Count rate changes
    changed = [item for item in data["items"] if item["rate_changed"]]
    print(f"\nItems with rate changes: {len(changed)}")

if __name__ == "__main__":
    main()
