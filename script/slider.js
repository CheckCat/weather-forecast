const setHandlerClick = (leftBtn, rightBtn, slider) => {

    const moveSlider = () => {
        const card = slider.children[0];
        let scroll = 0;
        slider.style.right = '0px';
        leftBtn.classList.add('deactive');

        return (condition) => {
            if (condition === 'left' && scroll != 0) {
                rightBtn.classList.contains('deactive') && rightBtn.classList.remove('deactive');
                scroll -= card.clientWidth;
            }
            if (condition === 'right' && scroll != card.clientWidth * (slider.children.length - 1)) {
                leftBtn.classList.contains('deactive') && leftBtn.classList.remove('deactive');
                scroll += card.clientWidth;
            }
            slider.style.right = `${scroll}px`;

            if (scroll == 0) {
                leftBtn.classList.add('deactive');
            }
            if (scroll == card.clientWidth * (slider.children.length - 1)) {
                rightBtn.classList.add('deactive');
            }
        }
    }

    const moveSliderFunc = moveSlider();
    console.log(moveSliderFunc)

    leftBtn.addEventListener('click', () => moveSliderFunc('left'));
    rightBtn.addEventListener('click', () => moveSliderFunc('right'));

}


