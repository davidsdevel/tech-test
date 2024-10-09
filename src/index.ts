
class Hand {
  public deck: number[] = [];
  static shuffler(data: number[]) {
    for (let i = 0; i < data.length - 1; i++) {
      let r = i + (Math.floor(Math.random() * (data.length - i)));
      let tmp = data[i];
      data[i] = data[r];
      data[r] = tmp;
    }

    return data
  }
  
  shuffle() {
    const deck = Hand.shuffler([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
    ]);

    this.deck = deck;
  }
}

class Backend {
  hand: Hand
  
  shuffle() {
    this.hand = new Hand()

    this.hand.shuffle();
  }
  getDeck() {
    return this.hand.deck;
  }
  async getCard(index: number) {
    return new Promise((resolve) => {
      const time = Math.floor(Math.random() * (100 - 50 + 1) + 50)

      setTimeout(() => {
        resolve(this.hand.deck[index]);
      }, time);
    });
  }
}

class Frontend {
  private numHands = parseInt(process.argv[2] || '10');
  private backend = new Backend();

  async playHand() {
    this.backend.shuffle();

    const promises = []

    const randomSlotPosition = Hand.shuffler([
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
    ]);

    for (let i = 0; i < randomSlotPosition.length; i++) {
      const promise = this.backend.getCard(randomSlotPosition[i])
      
      promises.push(promise)
    }

    const hand = await Promise.all(promises);

    return {
      deck: this.backend.getDeck(),
      hand,
      isSorted: this.isSorted(hand)
    }
  }
  isSorted(cards: number[]) {
    return cards.every((val, i, arr) => i === 0 || val >= arr[i - 1]);
  }
  caclculateSuccessRate(results) {
    let successCount = 0;

    for (const hand of results) {
      if (hand.isSorted) {
        successCount++;
      }
    }
    
    return `Dealt ${this.numHands} hands. Sorted hands: ${successCount}. Success rate: ${successCount / this.numHands * 100}%`;
  }

  async play() {
    const times = []
    const results = []

    for (let i = 0; i < this.numHands; i++) {
      const startTime = Date.now();
      const response = await this.playHand();
      const endTime = Date.now();

      const responseTime = endTime - startTime;

      if (responseTime > 400) {
        throw new Error(`Hand ${i + 1} took ${responseTime}ms to complete. Deck: ${response.deck.join(', ')}. Hand: ${response.hand.join(', ')}. Is sorted: ${response.isSorted}`)
      }

      times.push(responseTime);
      results.push(results)

      console.log(`Dealt hand ${i + 1} in ${responseTime}ms. Deck: ${response.deck.join(', ')}. Hand: ${response.hand.join(', ')}. Is sorted: ${response.isSorted}`)
    }
    console.log('--------------------------------------------------')

    console.log(this.caclculateSuccessRate(results));
    console.log(`Average time: ${times.reduce((a, b) => a + b, 0) / times.length}ms`);
  }
}

const frontend = new Frontend();

frontend.play();
