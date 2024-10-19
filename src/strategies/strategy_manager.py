class StrategyManager:
    def __init__(self):
        self.strategies = {}

    def add_strategy(self, name, strategy_function):
        if name not in self.strategies:
            self.strategies[name] = strategy_function
            print(f"Strategy {name} added.")
        else:
            print(f"Strategy {name} already exists.")

    def remove_strategy(self, name):
        if name in self.strategies:
            del self.strategies[name]
            print(f"Strategy {name} removed.")
        else:
            print(f"Strategy {name} does not exist.")

    def execute_strategy(self, name, data):
        if name in self.strategies:
            return self.strategies[name](data)
        else:
            print(f"Strategy {name} does not exist.")
            return None

# Example usage
if __name__ == "__main__":
    from macd_divergence import macd_divergence_strategy

    manager = StrategyManager()
    manager.add_strategy("MACD Divergence", macd_divergence_strategy)

    # Assuming 'data' is a DataFrame with the necessary structure
    data = None  # Replace with actual data
    trades = manager.execute_strategy("MACD Divergence", data)
    print(trades)
