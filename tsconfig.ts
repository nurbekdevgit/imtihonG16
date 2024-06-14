{
    "compilerOptions": {
        "target": "es5",
            "lib": ["es2016", "dom"],
                "module": "System",
                    "declaration": false,
                        "outFile": "./dist/index.js",
                            "strict": true, // Kengaytirilgan sinashni yoqish
                                "esModuleInterop": true, // CommonJS va ES modullari o'rtasida muvofiqlikni ta'minlash
                                    "forceConsistentCasingInFileNames": true
    },
    "include": ["./src/**/*"]
}