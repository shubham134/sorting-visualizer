$(document).ready(function() {

    /***************************************************************************
      Initial setup
     **************************************************************************/

    // setup array
    size = parseInt($('#size').val());
    arr = new Array(size);
    for(var i = 0; i < size; i++) {
        arr[i] = 0;
    }
    minValue = 1;
    maxValue = 100;
    initArray();

    // setup animation speed
    invSpeed = 1000 + 1;
    speed = invSpeed - $('#speed').val();
    forceStop = false;

    // set algo
    algos = ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Shell Sort', 'Quick Sort', 'Merge Sort'];
    initAlgos();
    algo = algos[0];

    // set graph
    drawGrap();

    /***************************************************************************
      Events function
     **************************************************************************/

    // set array size
    $('#size').on('input', function() {
        size = parseInt($('#size').val());
        arr = new Array(size);
        for(var i = 0; i < size; i++) {
            arr[i] = 0;
        }
        initArray();
        drawGrap()
    });

    // set animation speed
    $('#speed').on('input', function() {
        speed = invSpeed - $('#speed').val();
    });

    // select algo
    $("select#algo").change(function(){
        algo = $(this).children("option:selected").val();
    });

    // sort array
    $('#sort').on('click', async function() {
        forceStop = false;
        if(isSorted()) {
            alert('Already sorted');
            return;
        }
        disableInputs();
        switch(algo) {

            case 'Bubble Sort':
                await bubbleSort();
                break;

            case 'Selection Sort':
                await selectionSort();
                break;

            case 'Insertion Sort':
                await insertionSort();
                break;
            
            case 'Shell Sort':
                await shellSort();
                break;

            case 'Quick Sort':
                await quickSort(0, size - 1);
                break;

            case 'Merge Sort':
                await mergeSort(0, size - 1);
                break;
        }
        enableInputs();
    });

    $('#stop').on('click', async function() {
        forceStop = true;
        enableInputs();
    });

    /***************************************************************************
      Utility functions
     **************************************************************************/

    function initArray() {
        for(var i = 0; i < size; i++) {
            arr[i] = Math.round(minValue + Math.random() * (maxValue - minValue + 1));
        }
    }

    /* function displayArray() {
        console.log('------------------------------');
        for(var i = 0; i < size; i++) {
            console.log(arr[i]);
        }
    } */

    function initAlgos() {
        for(var i = 0; i < algos.length; i++) {
            $('#algo').append('<option class="btn btn-outline-primary btn-lg">' + algos[i] + '</option>');
        }
    }

    function isSorted() {
        for(var i = 0; i < size - 1; i++) {
            if(arr[i] > arr[i + 1]) {
                return false;
            }
        }
        return true;
    }

    function disableInputs() {
        $('#size').attr('disabled', 'disabled');
        $('#sizeSet').css('opacity', '0.6');
        $('#algo').attr('disabled', 'disabled');
        $('#sort').attr('hidden', 'hidden');
        $('#stop').removeAttr('hidden');
    }

    function enableInputs() {
        $('#size').removeAttr('disabled');
        $('#sizeSet').css('opacity', '1');
        $('#algo').removeAttr('disabled');
        $('#stop').attr('hidden', 'hidden');
        $('#sort').removeAttr('hidden');
    }

    function sleep(ms) {
        //return new Promise(resolve => setTimeout(resolve, ms));
        return new Promise(function(resolve) {
            if(!forceStop) {
                setTimeout(resolve, ms);
            }
        });
    }

    /***************************************************************************
      Animation functions
     **************************************************************************/

    function drawGrap() {
        $('#graph').text('');
        var barWidth = 1100 / size;
        for(var i = 0; i < size; i++) {
            var barHeight = arr[i];
            var bar = '<div class="bar" id="' + i + '" style="height: ' + barHeight + '%; width: ' + barWidth + 'px;">';
            bar += '<span class="value" id="s' + i + '">' + arr[i] + '</span>';
            bar += '</div>'
            $('#graph').append(bar);
        }
    }

    function changeBarAttr(id) {
        $('#' + id).attr('id', id);
        $('#' + id).css('height', arr[id] + '%');
        $('#s' + id).attr('id', 's' + id);
        $('#s' + id).text(arr[id]);
    }

    /***************************************************************************
      Algorithms
     **************************************************************************/

    // swap two elements
    function swap(index1, index2) {
        if(index1 == index2) {
            return;
        }
        var temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
        changeBarAttr(index1);
        changeBarAttr(index2);
    }

    /********************************
     * Bubble Sort
    ********************************/

    async function bubbleSort() {
        for(var lastUnsortedIndex = size - 1; lastUnsortedIndex > 0; lastUnsortedIndex--) {
            for(var i = 0; i < lastUnsortedIndex; i++) {
                if(arr[i] > arr[i + 1]) {
                    swap(i, i + 1);
                    await sleep(speed);
                }
            }
        }
    }

    /********************************
     * Selection Sort
    ********************************/

    async function selectionSort() {
        for(var lastUnsortedIndex = size - 1; lastUnsortedIndex > 0; lastUnsortedIndex--) {
            var largest = 0;
            for(var i = 1; i <= lastUnsortedIndex; i++) {
                if(arr[i] > arr[largest]) {
                    largest = i;
                }
            }
            swap(largest, lastUnsortedIndex);
            await sleep(speed);
        }
    }

    /********************************
     * Insertion Sort
    ********************************/

    async function insertionSort() {
        for(var firstUnsortedIndex = 1; firstUnsortedIndex < size; firstUnsortedIndex++) {
			var newElement = arr[firstUnsortedIndex];
			var i;
			for(i = firstUnsortedIndex; i > 0 && arr[i - 1] > newElement; i--) {
                    arr[i] = arr[i - 1];
                    changeBarAttr(i);
                    await sleep(speed);
			}
            arr[i] = newElement;
            changeBarAttr(i);
            await sleep(speed);
        }
    }

    /********************************
     * Shell Sort
    ********************************/

    async function shellSort() {
        for(var step = Math.floor(size / 2); step > 0; step = Math.floor(step / 2)) {
			for(var firstUnsortedIndex = step; firstUnsortedIndex < size; firstUnsortedIndex++) {
                var newElement = arr[firstUnsortedIndex];
                var i;
                for(i = firstUnsortedIndex; i >= step && arr[i - step] > newElement; i -= step) {
                    arr[i] = arr[i - step];
                    changeBarAttr(i);
                    await sleep(speed);
                }
                arr[i] = newElement;
                changeBarAttr(i);
                await sleep(speed);
            }
        }
    }

    /********************************
     * Quick Sort
    ********************************/

    async function partition(low, high) {
        var pivot = arr[high];  
        var i = (low - 1);
        for(var j = low; j <= high- 1; j++) {
            if(arr[j] < pivot) {
                i++;
                swap(i, j);
                await sleep(speed);
            }
        }
        swap(i + 1, high);
        await sleep(speed);
        return (i + 1);
    }

    async function quickSort(low, high) {
        if (low < high) {
            var pivot = await partition(low, high);
            await quickSort(low, pivot - 1);
            await quickSort(pivot + 1, high);
        }
    }

    /********************************
     * Merge Sort
    ********************************/

    async function merge(l, m, r) {
        var n1 = m - l + 1; 
        var n2 = r - m; 
        var L = new Array(n1);
        var R = new Array(n2);
        for(var i = 0; i < n1; i++) 
            L[i] = arr[l + i]; 
        for(var j = 0; j < n2; j++) 
            R[j] = arr[m + 1 + j];
    
        var i = 0;  
        var j = 0;  
        var k = l; 
        
        while(i < n1 && j < n2) { 
            if (L[i] <= R[j]) {
                arr[k] = L[i]; 
                i++; 
            } else { 
                arr[k] = R[j]; 
                j++; 
            }
            changeBarAttr(k);
            await sleep(speed);
            k++; 
        } 
        while (i < n1) { 
            arr[k] = L[i];
            changeBarAttr(k);
            await sleep(speed);
            i++; 
            k++; 
        } 
        while (j < n2) { 
            arr[k] = R[j];
            changeBarAttr(k);
            await sleep(speed);
            j++; 
            k++; 
        }
    }

    async function mergeSort(l, r) {
        if (l < r) {
            var m = Math.floor((l + r) / 2);
            await mergeSort(l, m);
            await mergeSort(m + 1, r);
            await merge(l, m, r);
        }
    }

});